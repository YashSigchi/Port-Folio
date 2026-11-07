export interface WorkflowRoleLegend {
  role: string;
  color: string;
}

export interface WorkflowNode {
  id: string;
  stepNumber?: string;
  label: string;
  description: string;
  ownerRole: string;
  notify?: boolean;
  row: number;
  col?: number;
}

export interface WorkflowEdge {
  from: string;
  to: string;
  label?: string;
}

export interface WorkflowDiagramData {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  roles: WorkflowRoleLegend[];
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export const workflows: Record<string, WorkflowDiagramData> = {
  'tool-room-requisition': {
    id: 'tool-room-requisition',
    title: 'NBC Bearings — 8-Stage Requisition & Approval Flow',
    subtitle:
      'Role-based state transitions across Requestor, Approver, Tool Room Operator, and Admin with automated email notifications and action-level audit logging.',
    badge: 'Simplified view',
    roles: [
      { role: 'Requestor', color: '#818CF8' },
      { role: 'Approver', color: '#D946EF' },
      { role: 'Tool Room Operator', color: '#22D3EE' },
      { role: 'Admin', color: '#FBBF24' },
    ],
    nodes: [
      {
        id: 'stage-1',
        stepNumber: '01',
        label: 'Draft',
        description: 'Requestor prepares tool specifications and quantity.',
        ownerRole: 'Requestor',
        notify: false,
        row: 0,
      },
      {
        id: 'stage-2',
        stepNumber: '02',
        label: 'Submitted',
        description: 'Validated payload persisted; initial approver notified.',
        ownerRole: 'Requestor',
        notify: true,
        row: 1,
      },
      {
        id: 'stage-3',
        stepNumber: '03',
        label: 'Under review',
        description: 'Approver inspects requisition details and justification.',
        ownerRole: 'Approver',
        notify: false,
        row: 2,
      },
      {
        id: 'stage-4-approved',
        stepNumber: '04A',
        label: 'Approved',
        description: 'Cleared directly for tool room preparation.',
        ownerRole: 'Approver',
        notify: true,
        row: 3,
        col: 0,
      },
      {
        id: 'stage-4-forwarded',
        stepNumber: '04B',
        label: 'Forwarded',
        description: 'Escalated to senior approver for secondary sign-off.',
        ownerRole: 'Approver',
        notify: true,
        row: 3,
        col: 1,
      },
      {
        id: 'stage-4-rejected',
        stepNumber: '04C',
        label: 'Rejected',
        description: 'Returned with reason logged in audit trail.',
        ownerRole: 'Approver',
        notify: true,
        row: 3,
        col: 2,
      },
      {
        id: 'stage-5',
        stepNumber: '05',
        label: 'Forwarded approver review',
        description: 'Secondary approver validates escalated requisition.',
        ownerRole: 'Approver',
        notify: true,
        row: 4,
      },
      {
        id: 'stage-6',
        stepNumber: '06',
        label: 'Ready at tool room',
        description: 'Operator prepares requested tooling for pickup.',
        ownerRole: 'Tool Room Operator',
        notify: true,
        row: 5,
      },
      {
        id: 'stage-7',
        stepNumber: '07',
        label: 'Issued',
        description: 'Tool handed over on floor; issuance logged.',
        ownerRole: 'Tool Room Operator',
        notify: true,
        row: 6,
      },
      {
        id: 'stage-8',
        stepNumber: '08',
        label: 'Closed',
        description: 'Lifecycle completed with immutable audit record.',
        ownerRole: 'Admin',
        notify: false,
        row: 7,
      },
    ],
    edges: [
      { from: 'stage-1', to: 'stage-2' },
      { from: 'stage-2', to: 'stage-3' },
      { from: 'stage-3', to: 'stage-4-approved' },
      { from: 'stage-3', to: 'stage-4-forwarded' },
      { from: 'stage-3', to: 'stage-4-rejected' },
      { from: 'stage-4-forwarded', to: 'stage-5' },
      { from: 'stage-4-approved', to: 'stage-6' },
      { from: 'stage-5', to: 'stage-6' },
      { from: 'stage-6', to: 'stage-7' },
      { from: 'stage-7', to: 'stage-8' },
    ],
  },
  'ai-customer-support': {
    id: 'ai-customer-support',
    title: 'LangGraph Multi-Agent Support Routing & RAG Flow',
    subtitle:
      'Stateful multi-agent orchestration across specialized domain agents with FAISS retrieval, SQLite memory checkpoints, and human-in-the-loop validation.',
    badge: 'Simplified view',
    roles: [
      { role: 'Router & Orchestration', color: '#818CF8' },
      { role: 'Specialist Agent', color: '#D946EF' },
      { role: 'RAG & Memory (FAISS / SQLite)', color: '#22D3EE' },
      { role: 'Human-in-the-Loop Gate', color: '#FBBF24' },
    ],
    nodes: [
      {
        id: 'user-query',
        stepNumber: '01',
        label: 'User query',
        description: 'Incoming support message with session identifier.',
        ownerRole: 'Router & Orchestration',
        row: 0,
      },
      {
        id: 'router-agent',
        stepNumber: '02',
        label: 'Router agent + SQLite memory',
        description: 'Loads cross-session history from SQLite and classifies intent.',
        ownerRole: 'Router & Orchestration',
        row: 1,
      },
      {
        id: 'agent-sales',
        stepNumber: '03A',
        label: 'Sales agent',
        description: 'Plans, pricing, and product tier inquiries.',
        ownerRole: 'Specialist Agent',
        row: 2,
        col: 0,
      },
      {
        id: 'agent-technical',
        stepNumber: '03B',
        label: 'Technical agent',
        description: 'Debugging, integration, and platform troubleshooting.',
        ownerRole: 'Specialist Agent',
        row: 2,
        col: 1,
      },
      {
        id: 'agent-billing',
        stepNumber: '03C',
        label: 'Billing agent',
        description: 'Invoices, refunds, and subscription adjustments.',
        ownerRole: 'Specialist Agent',
        row: 2,
        col: 2,
      },
      {
        id: 'agent-account',
        stepNumber: '03D',
        label: 'Account agent',
        description: 'Access, security, and profile state changes.',
        ownerRole: 'Specialist Agent',
        row: 2,
        col: 3,
      },
      {
        id: 'rag-faiss',
        stepNumber: '04',
        label: 'RAG retrieval (FAISS)',
        description: 'Grounds agent context in verified documentation chunks.',
        ownerRole: 'RAG & Memory (FAISS / SQLite)',
        row: 3,
      },
      {
        id: 'sensitive-check',
        stepNumber: '05',
        label: 'Sensitive action? → Human-in-the-loop approval',
        description: 'High-impact billing or account actions require human sign-off.',
        ownerRole: 'Human-in-the-Loop Gate',
        notify: true,
        row: 4,
      },
      {
        id: 'response-node',
        stepNumber: '06',
        label: 'Response + SQLite checkpoint',
        description: 'Streams grounded answer and persists updated conversation state.',
        ownerRole: 'RAG & Memory (FAISS / SQLite)',
        row: 5,
      },
    ],
    edges: [
      { from: 'user-query', to: 'router-agent' },
      { from: 'router-agent', to: 'agent-sales' },
      { from: 'router-agent', to: 'agent-technical' },
      { from: 'router-agent', to: 'agent-billing' },
      { from: 'router-agent', to: 'agent-account' },
      { from: 'agent-sales', to: 'rag-faiss' },
      { from: 'agent-technical', to: 'rag-faiss' },
      { from: 'agent-billing', to: 'rag-faiss' },
      { from: 'agent-account', to: 'rag-faiss' },
      { from: 'rag-faiss', to: 'sensitive-check' },
      { from: 'sensitive-check', to: 'response-node' },
    ],
  },
};
