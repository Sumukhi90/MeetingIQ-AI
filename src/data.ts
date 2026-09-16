export type Status = 'Open' | 'In progress' | 'Completed';
export type Speaker = { name: string; role: string; initials: string; color: string };
export type TranscriptEntry = { id: string; time: number; speaker: string; text: string; topic?: string };
export type ActionItem = { id: string; task: string; owner: string; due: string; status: Status; time: number; meetingId: string };
export type Highlight = { id: string; meetingId: string; time: number; speaker: string; quote: string; note: string };
export type Meeting = { id: string; title: string; date: string; time: string; duration: number; source: string; type: string; participants: Speaker[]; summary: string; topics: string[]; decisions: { text: string; time: number }[]; transcript: TranscriptEntry[]; actionItems: ActionItem[]; highlights: Highlight[]; accent: string };

export const speakers: Speaker[] = [
  { name: 'Alex Morgan', role: 'Product', initials: 'AM', color: '#1d6b68' }, { name: 'Sarah Chen', role: 'Customer Success', initials: 'SC', color: '#d06b45' }, { name: 'David Kim', role: 'Engineering', initials: 'DK', color: '#4c68a8' }, { name: 'Priya Shah', role: 'Marketing', initials: 'PS', color: '#9a5c9a' }, { name: 'Daniel Brooks', role: 'Sales', initials: 'DB', color: '#b18a36' }, { name: 'Maya Patel', role: 'Design', initials: 'MP', color: '#297d85' }, { name: 'James Wilson', role: 'Leadership', initials: 'JW', color: '#6d7180' }, { name: 'Olivia Carter', role: 'Data', initials: 'OC', color: '#ba5362' }
];
const t = (id: string, time: number, speaker: string, text: string, topic?: string): TranscriptEntry => ({ id, time, speaker, text, topic });
const heroTranscript: TranscriptEntry[] = [
 t('t1', 132, 'Alex Morgan', 'Let\'s start with the retention numbers from Q2. We finished stronger than forecast, but the shape of the growth matters.', 'Retention'),
 t('t2', 254, 'Olivia Carter', 'Retention improved 8% quarter over quarter. The clearest opportunity is still the first fourteen days of onboarding.', 'Onboarding'),
 t('t3', 421, 'Sarah Chen', 'Customers love the product once they reach the aha moment. The friction is setup: permissions, imports, and knowing what to do next.', 'Onboarding'),
 t('t4', 609, 'Maya Patel', 'We have a draft of a guided workspace. It cuts the initial choices down to three paths based on the team\'s goal.', 'Onboarding'),
 t('t5', 781, 'David Kim', 'The guided flow is a manageable Q3 project. I want to protect capacity for the enterprise permissions work as well.', 'Roadmap'),
 t('t6', 1030, 'Daniel Brooks', 'Enterprise buyers are asking for the AI workspace in every late-stage conversation. October is the date I am hearing from the market.', 'Enterprise AI'),
 t('t7', 1248, 'James Wilson', 'We should avoid a broad launch until the onboarding baseline is healthier. A smaller beta gives us evidence without over-promising.', 'Launch'),
 t('t8', 1452, 'Alex Morgan', 'Agreed. Let\'s make the enterprise AI beta an October target, with onboarding improvements first in the sequence.', 'Launch'),
 t('t9', 1639, 'Priya Shah', 'For launch messaging, the story should be less about magic and more about teams finding answers in their own work.', 'Marketing'),
 t('t10', 1874, 'David Kim', 'To hit October, I need two engineers moved onto onboarding and one platform engineer on the beta architecture.', 'Engineering'),
 t('t11', 2140, 'Sarah Chen', 'I can bring five customer teams into a feedback group. We should measure time to first useful answer and setup completion.', 'Customer Feedback'),
 t('t12', 2398, 'Olivia Carter', 'I will build the dashboard around those metrics and add pricing cohort data so we can see if usage translates to expansion.', 'Pricing'),
 t('t13', 2672, 'Daniel Brooks', 'On pricing, the feedback is positive for a workspace tier, but procurement needs predictable seats and usage guardrails.', 'Pricing'),
 t('t14', 2916, 'Maya Patel', 'I will pair the onboarding checklist with the new AI workspace so the first session feels connected, not like two products.', 'Design'),
 t('t15', 3164, 'James Wilson', 'The risk is focus. We have a clear sequence now: onboarding, beta architecture, then the October customer beta.', 'Roadmap'),
 t('t16', 3420, 'Alex Morgan', 'Let\'s capture the decisions: prioritize onboarding, target October for beta, and add two engineers to the initiative.', 'Decisions'),
 t('t17', 3568, 'Sarah Chen', 'I\'ll own the funnel review and return with the biggest drop-off points by next Friday.', 'Action Items'),
];
const heroActions: ActionItem[] = [
 { id: 'a1', task: 'Review onboarding funnel drop-off and recommend the first fix', owner: 'Sarah Chen', due: 'Sep 22', status: 'Open', time: 3568, meetingId: 'q3-strategy' },
 { id: 'a2', task: 'Prepare enterprise AI beta architecture proposal', owner: 'David Kim', due: 'Sep 25', status: 'In progress', time: 1874, meetingId: 'q3-strategy' },
 { id: 'a3', task: 'Finalize October launch messaging with customer language', owner: 'Priya Shah', due: 'Sep 20', status: 'Open', time: 1639, meetingId: 'q3-strategy' },
 { id: 'a4', task: 'Recruit five customer teams for beta feedback group', owner: 'Sarah Chen', due: 'Sep 18', status: 'Completed', time: 2140, meetingId: 'q3-strategy' },
 { id: 'a5', task: 'Build retention and setup completion dashboard', owner: 'Olivia Carter', due: 'Sep 27', status: 'Open', time: 2398, meetingId: 'q3-strategy' }
];
const heroHighlights: Highlight[] = [
 { id: 'h1', meetingId: 'q3-strategy', time: 1452, speaker: 'Alex Morgan', quote: 'Enterprise AI beta target moved to October.', note: 'Clear launch milestone' },
 { id: 'h2', meetingId: 'q3-strategy', time: 421, speaker: 'Sarah Chen', quote: 'The friction is setup: permissions, imports, and knowing what to do next.', note: 'Root cause of churn' }
];
export const meetings: Meeting[] = [
 { id: 'q3-strategy', title: 'Q3 Product Strategy Review', date: 'Sep 15, 2025', time: '10:00 AM', duration: 3600, source: 'Google Meet', type: 'Strategy', participants: speakers, summary: 'Q3 planning focused on improving customer retention, reducing onboarding friction, and preparing the enterprise AI launch. The team agreed to prioritize onboarding improvements before expanding the enterprise feature set.', topics: ['Retention', 'Onboarding', 'Enterprise AI', 'Roadmap', 'Pricing', 'Launch', 'Customer Feedback'], decisions: [{ text: 'Prioritize onboarding improvements before enterprise AI expansion.', time: 1452 }, { text: 'Target the enterprise AI beta for October.', time: 1452 }, { text: 'Add two engineers to the onboarding initiative.', time: 1874 }], transcript: heroTranscript, actionItems: heroActions, highlights: heroHighlights, accent: '#1d6b68' },
 ...[
  ['Customer Discovery Interviews','Sep 12, 2025','2:00 PM',2700,'Zoom','Customer','Onboarding, Feedback','We heard a consistent request for clearer setup milestones and more transparent import progress.'],
  ['Engineering Sprint Planning','Sep 11, 2025','11:30 AM',2700,'Microsoft Teams','Planning','API, Reliability, Roadmap','The team aligned on API reliability work and a smaller batch of platform improvements for the next sprint.'],
  ['Product Design Critique','Sep 10, 2025','9:30 AM',3600,'Google Meet','Design','Onboarding, Research','Design reviewed the guided workspace prototype and agreed to test the three-path entry point.'],
  ['Sales Pipeline Review','Sep 9, 2025','3:00 PM',2400,'Zoom','Sales','Enterprise, Pricing','The pipeline is healthy, with procurement and predictable pricing emerging as the key enterprise questions.'],
  ['Marketing Launch Planning','Sep 8, 2025','1:00 PM',3000,'Google Meet','Marketing','Launch, Messaging','Marketing mapped the October beta narrative around practical team knowledge and measurable time saved.'],
  ['Weekly Leadership Sync','Sep 5, 2025','10:00 AM',1800,'Microsoft Teams','Leadership','Focus, Hiring','Leadership confirmed hiring priorities and reduced the number of parallel Q3 bets.'],
  ['Customer Success Review','Sep 4, 2025','2:30 PM',2400,'Zoom','Customer','Retention, Accounts','Success reviewed renewal risks and a shortlist of teams for the guided onboarding pilot.'],
  ['Hiring Planning','Sep 3, 2025','11:00 AM',2100,'Google Meet','People','Engineering, Hiring','The hiring plan prioritizes two product engineers and a customer researcher for the next quarter.'],
  ['Data & Analytics Review','Sep 2, 2025','4:00 PM',2700,'Google Meet','Analytics','Retention, Metrics','Analytics defined the first version of the retention dashboard and agreed on shared metric definitions.']
 ].map((m, i) => ({ id: `meeting-${i + 2}`, title: m[0] as string, date: m[1] as string, time: m[2] as string, duration: m[3] as number, source: m[4] as string, type: m[5] as string, participants: speakers.slice(0, 3 + i % 4), summary: m[7] as string, topics: (m[6] as string).split(', '), decisions: [{ text: m[7] as string, time: 420 }], transcript: [t(`m${i}a`, 120, speakers[i % speakers.length].name, m[7] as string, (m[6] as string).split(',')[0])], actionItems: [], highlights: [], accent: ['#c2684b','#4c68a8','#9a5c9a','#b18a36'][i % 4] }))
];
export const allActions = () => meetings.flatMap(m => m.actionItems);
export const allHighlights = () => meetings.flatMap(m => m.highlights);
export const formatTime = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
