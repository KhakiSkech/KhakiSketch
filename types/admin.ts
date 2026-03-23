// Firestore 컬렉션 타입 정의

// ===== Projects (포트폴리오) =====
export type ProjectCategory = 'MVP' | 'AUTOMATION' | 'TRADING' | 'PROTOTYPE';
export type ProjectStatus = 'PUBLISHED' | 'SAMPLE' | 'PROTOTYPE' | 'INTERNAL';
export type ThumbnailPattern = 'Pattern1' | 'Pattern2' | 'Pattern3';

export interface ProjectThumbnail {
  pattern?: ThumbnailPattern;
  imageUrl?: string;
}

export interface ProjectChallenge {
  title: string;
  items: string[];
}

export interface ProjectSolutionItem {
  title: string;
  description: string;
}

export interface ProjectSolution {
  title: string;
  items: ProjectSolutionItem[];
}

export interface ProjectMetric {
  label: string;
  value: string;
  unit?: string;
}

export interface ProjectResult {
  title: string;
  metrics: ProjectMetric[];
  summary: string;
}

export interface ProjectTech {
  frontend?: string[];
  backend?: string[];
  database?: string[];
  other?: string[];
}

export interface ProjectImage {
  title: string;
  description: string;
  url: string;
}

export interface ProjectLinks {
  live?: string;
  github?: string;
  caseStudy?: string;
}

export interface FirestoreProject {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  thumbnail: ProjectThumbnail;
  content: string;
  contentFormat?: 'html' | 'markdown';
  images?: { url: string; caption?: string }[];
  featured?: boolean;
  status: ProjectStatus;
  createdAt?: string;
  updatedAt?: string;
  
  // Legacy fields (이전 데이터 호환용 + 정적 데이터 호환)
  tag?: string;
  period?: string;
  teamSize?: string;
  overview?: string;
  challenge?: ProjectChallenge;
  solution?: ProjectSolution;
  result?: ProjectResult;
  tech?: ProjectTech;
  markdownContent?: string;
  links?: ProjectLinks;
  relatedProjects?: string[];
}

// ===== Articles (블로그) =====
export type ArticleCategory = 'INSIGHT' | 'GUIDE' | 'CASE_STUDY' | 'NEWS';

export interface FirestoreArticle {
  slug: string;
  title: string;
  description: string;
  category: ArticleCategory;
  publishedAt: string;
  readingTime: string;
  tags: string[];
  featured?: boolean;
  coverImage?: string;
  content: string;
  contentFormat?: 'html' | 'markdown';
  createdAt?: string;
  updatedAt?: string;
}

// ===== Site Settings =====

// Stats (통계)
export interface SiteStats {
  completedProjects: number;
  customerSatisfaction: number;
  avgDeliveryTime: number;
  repeatOrderRate: number;
}

// FAQ
export type FAQCategory = 'GENERAL' | 'PROCESS' | 'PRICING' | 'TECH' | 'SUPPORT';

export interface FAQItem {
  id: string;
  category: FAQCategory;
  question: string;
  answer: string;
  order: number;
}

export interface SiteFAQ {
  items: FAQItem[];
}

// Testimonials (고객 후기)
export interface TestimonialItem {
  id: string;
  content: string;
  author: string;
  role: string;
  company?: string;
  projectType: string;
  rating?: number;
  order: number;
}

export interface SiteTestimonials {
  items: TestimonialItem[];
}

// Pricing (가격표)
export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  priceNote?: string;
  features: PricingFeature[];
  highlighted?: boolean;
  ctaText: string;
  order: number;
}

export interface SitePricing {
  plans: PricingPlan[];
}

// Hero Images (히어로 이미지)
export interface SiteHeroImages {
  imageBack: string;
  imageFront: string;
}

// 통합 사이트 설정
export interface SiteSettings {
  stats?: SiteStats;
  faq?: SiteFAQ;
  testimonials?: SiteTestimonials;
  pricing?: SitePricing;
  hero?: SiteHeroImages;
}

// ===== Form Types =====
export interface ProjectFormData extends Omit<FirestoreProject, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
}

// 간소화된 새 폼 타입
export interface SimpleProjectFormData {
  id?: string;
  title: string;
  description: string;
  category: ProjectCategory;
  thumbnail: ProjectThumbnail;
  content: string; // 마크다운 통합
  images: { url: string; caption?: string }[];
  featured: boolean;
  status: ProjectStatus;
  // 프로젝트 상세 필드
  tag?: string;
  period?: string;
  teamSize?: string;
  overview?: string;
  tech?: ProjectTech;
  challenge?: ProjectChallenge;
  solution?: ProjectSolution;
  result?: ProjectResult;
  links?: ProjectLinks;
}

export interface ArticleFormData extends Omit<FirestoreArticle, 'createdAt' | 'updatedAt'> { }

// ===== Quote Leads (견적/CRM) =====
export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUOTED' | 'NEGOTIATING' | 'WON' | 'LOST' | 'HOLD';
export type LeadPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type LeadSource = 'WEBSITE' | 'REFERRAL' | 'ADS' | 'DIRECT' | 'ETC';
export type ActivityType = 'NOTE' | 'EMAIL' | 'CALL' | 'MEETING' | 'QUOTE_SENT' | 'STATUS_CHANGE' | 'FOLLOWUP';

export interface LeadNote {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
}

export interface LeadActivity {
  id: string;
  type: ActivityType;
  description: string;
  metadata?: Record<string, any>;
  createdBy: string;
  createdAt: string;
}

export interface QuoteLead {
  id: string;
  
  // 프로젝트 정보
  projectType: string;
  projectTypeOther?: string;
  projectName: string;
  projectSummary: string;
  projectDescription: string;
  projectGoal: string;
  projectTags: string[];
  referenceUrl?: string;
  isGovernmentFunded: boolean;
  targetExchanges?: string[];
  
  // 기술/요구사항
  platforms: string[];
  currentStage: string;
  features: string[];
  techStack: string[];
  
  // 예산/일정
  budget: string;
  timeline: string;
  
  // 고객 정보
  customerName: string;
  company?: string;
  email: string;
  phone: string;
  preferredContact: string[];
  
  // CRM 필드
  status: LeadStatus;
  priority: LeadPriority;
  assignedTo?: string;
  source: LeadSource;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  
  // 추적
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  landingPage: string;
  
  // 타임라인
  createdAt: string;
  updatedAt: string;
  contactedAt?: string;
  quotedAt?: string;
  closedAt?: string;
  
  // 노트/히스토리
  notes: LeadNote[];
  activities: LeadActivity[];
}

export interface LeadStats {
  total: number;
  byStatus: Record<LeadStatus, number>;
  byPriority: Record<LeadPriority, number>;
  bySource: Record<LeadSource, number>;
  thisMonth: number;
  conversionRate: number;
  averageResponseTime: number;
}

// ===== CRM Enhancements =====

// 할 일/리마인더
export type TodoStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
export type TodoPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface LeadTodo {
  id: string;
  leadId: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate?: string;
  completedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// 견적서 발송
export type QuoteEmailStatus = 'DRAFT' | 'SENT' | 'VIEWED' | 'ACCEPTED' | 'REJECTED';

export interface QuoteEmailItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface QuoteEmail {
  id: string;
  leadId: string;
  subject: string;
  content: string;
  items: QuoteEmailItem[];
  totalAmount: number;
  taxAmount?: number;
  grandTotal: number;
  validUntil?: string;
  status: QuoteEmailStatus;
  sentAt?: string;
  viewedAt?: string;
  respondedAt?: string;
  pdfUrl?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// 고객 통계
export interface CustomerStats {
  customerEmail: string;
  customerName: string;
  company?: string;
  totalLeads: number;
  totalQuotes: number;
  totalContracts: number;
  totalContractAmount: number;
  successRate: number;
  averageResponseTime: number;
  firstContactDate: string;
  lastContactDate: string;
  leadIds: string[];
}
