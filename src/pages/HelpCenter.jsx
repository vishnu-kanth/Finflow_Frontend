import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  HelpCircle, BookOpen, FileText, ShieldCheck, CreditCard,
  MessageSquare, ChevronDown, ChevronUp, Mail, Phone,
  Clock, CheckCircle, AlertCircle, Zap, Users, Bot, Search, ChevronRight
} from 'lucide-react';

const faqData = [
  {
    category: 'Getting Started',
    icon: <Zap size={18} />,
    questions: [
      {
        q: 'What is FinFlow?',
        a: 'FinFlow is a smart, end-to-end loan management platform that helps applicants apply for, track, and manage loans seamlessly. Administrators can review, approve, or reject applications with AI-powered risk analysis.'
      },
      {
        q: 'How do I create an account?',
        a: 'Click "Sign Up" on the landing page. Enter your full name, email address, and a strong password. You will be registered as an Applicant by default. Admin accounts are provisioned separately by system administrators.'
      },
      {
        q: 'What documents do I need to apply for a loan?',
        a: 'You typically need: a government-issued ID (Aadhaar/PAN), proof of income (salary slip or bank statement), address proof, and any employment verification documents. Upload them via the Resource Vault section.'
      }
    ]
  },
  {
    category: 'Loan Applications',
    icon: <FileText size={18} />,
    questions: [
      {
        q: 'How do I submit a loan application?',
        a: 'Navigate to "My Applications" from the sidebar, click "New Application", fill in loan amount, purpose, tenure, employment type, monthly income, and PAN number. Save as Draft first, then click Submit when ready.'
      },
      {
        q: 'What are the different application statuses?',
        a: 'DRAFT — Saved but not submitted yet. SUBMITTED — Sent for admin review. UNDER_REVIEW — Being assessed by an administrator. APPROVED — Your loan has been approved. REJECTED — Application was declined. NEEDS_INFO — Admin requires additional documents or information. CANCELLED — You cancelled the application.'
      },
      {
        q: 'Can I edit my application after submitting?',
        a: 'No. Once an application is submitted, it cannot be edited. You can only edit applications in DRAFT status. If additional information is needed, the admin will change the status to NEEDS_INFO.'
      },
      {
        q: 'Can I have multiple active loan applications?',
        a: 'No. FinFlow enforces a single active loan constraint. You must complete or close your current application before submitting a new one.'
      }
    ]
  },
  {
    category: 'AI Features',
    icon: <Bot size={18} />,
    questions: [
      {
        q: 'What is the AI Risk Analysis?',
        a: 'When you submit a loan application, our AI engine (powered by Google Gemini) automatically analyzes your financial profile and generates a risk score (0-100), risk level (LOW/MEDIUM/HIGH), and a recommendation. This helps administrators make faster, data-driven decisions.'
      },
      {
        q: 'How does the AI Chatbot work?',
        a: 'The floating chat icon in the bottom-right corner connects you to our AI assistant. It can answer questions about the loan process, your application status, platform features, and general financial guidance. It is available on every page.'
      },
      {
        q: 'Is my data shared with the AI?',
        a: 'Only your role and name are sent as context to provide personalized responses. Your sensitive financial data (PAN, income, etc.) is never shared with the chatbot. Risk analysis uses anonymized application parameters only.'
      }
    ]
  },
  {
    category: 'Account & Security',
    icon: <ShieldCheck size={18} />,
    questions: [
      {
        q: 'How do I reset my password?',
        a: 'Go to Settings from the sidebar and use the Security section to update your password. You will need your current password to set a new one.'
      },
      {
        q: 'How is my data protected?',
        a: 'FinFlow uses JWT-based authentication, encrypted API communication through an API Gateway, and role-based access control (RBAC). Your documents are stored securely on Cloudinary with access-controlled URLs.'
      },
      {
        q: 'What are the different user roles?',
        a: 'APPLICANT — Can create and track loan applications, upload documents, and use the AI chatbot. ADMIN — Can review all applications, approve/reject loans, view system analytics, and access AI-powered risk insights.'
      }
    ]
  },
  {
    category: 'For Administrators',
    icon: <Users size={18} />,
    questions: [
      {
        q: 'How do I review a loan application?',
        a: 'From the Admin Console, click on any application card to open the review drawer. You will see the applicant details, AI risk analysis, and can Approve, Reject, or Request More Info with remarks.'
      },
      {
        q: 'What do the AI Risk badges mean?',
        a: 'LOW risk (green, score 70-100): Strong financial profile, recommended for approval. MEDIUM risk (yellow, score 40-69): Moderate risk, manual review recommended. HIGH risk (red, score 0-39): High default probability, caution advised.'
      },
      {
        q: 'Can I override the AI recommendation?',
        a: 'Yes, absolutely. The AI provides a recommendation to assist decision-making, but the final approval or rejection is always at the administrator\'s discretion.'
      }
    ]
  }
];

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div 
      style={{ 
        borderBottom: '1px solid #f1f5f9', 
        padding: '16px 0',
        cursor: 'pointer'
      }}
      onClick={() => setOpen(!open)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b', margin: 0 }}>{question}</p>
        {open ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
      </div>
      {open && (
        <p style={{ 
          margin: '10px 0 0 0', 
          fontSize: '0.85rem', 
          color: '#64748b', 
          lineHeight: '1.6',
          paddingRight: '24px'
        }}>
          {answer}
        </p>
      )}
    </div>
  );
};

const HelpCenter = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div className="dashboard-wrapper animate-fade-in" style={{ paddingBottom: '3rem' }}>
      
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Help Center</h1>
        <p className="text-slate-500 font-medium text-lg">Everything you need to know about using FinFlow — from applications to AI insights.</p>
      </div>

      {/* Quick Access Grid - 3 Horizontal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="card p-6 border-none shadow-md bg-indigo-600 text-white rounded-2xl hover:translate-y-[-4px] transition-all cursor-pointer" onClick={() => setActiveCategory(0)}>
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mb-4">
            <Zap size={20} className="text-white" />
          </div>
          <h3 className="font-bold mb-1">Quick Start</h3>
          <p className="text-xs text-indigo-100 font-medium">New here? Learn the basics in minutes.</p>
        </div>
        <div className="card p-6 border-none shadow-md bg-white rounded-2xl hover:translate-y-[-4px] transition-all cursor-pointer" onClick={() => setActiveCategory(1)}>
          <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center mb-4">
            <CreditCard size={20} className="text-amber-600" />
          </div>
          <h3 className="font-bold text-slate-800 mb-1">Loan Process</h3>
          <p className="text-xs text-slate-400 font-medium">Understand the full application workflow.</p>
        </div>
        <div className="card p-6 border-none shadow-md bg-white rounded-2xl hover:translate-y-[-4px] transition-all cursor-pointer" onClick={() => setActiveCategory(2)}>
          <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
            <Bot size={20} className="text-emerald-600" />
          </div>
          <h3 className="font-bold text-slate-800 mb-1">AI Intelligence</h3>
          <p className="text-xs text-slate-400 font-medium">How our risk analysis & chatbot works.</p>
        </div>
      </div>

      {/* Main Content: Sidebar + FAQ Section */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 mb-10">
        
        {/* Category Sidebar */}
        <div className="flex flex-col gap-1">
          <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.15em] px-5 mb-5">Support Topics</p>
          {faqData.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => setActiveCategory(idx)}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl cursor-pointer transition-all duration-200 group ${
                activeCategory === idx 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              <div className={`transition-colors ${activeCategory === idx ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`}>
                {React.cloneElement(cat.icon, { size: 20, strokeWidth: 2.5 })}
              </div>
              <span className="text-sm font-bold tracking-tight">{cat.category}</span>
            </div>
          ))}
        </div>

        {/* FAQ Content Area */}
        <div className="card shadow-xl p-8 rounded-3xl border border-slate-100 bg-white min-h-[400px]">
          <div className="flex items-center gap-4 mb-8 border-b border-slate-50 pb-6">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              {faqData[activeCategory].icon}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight" style={{ margin: 0 }}>{faqData[activeCategory].category}</h2>
              <p className="text-xs font-bold text-slate-400 mt-1">Showing {faqData[activeCategory].questions.length} related articles</p>
            </div>
          </div>
          <div className="space-y-1">
            {faqData[activeCategory].questions.map((item, idx) => (
              <FAQItem key={idx} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </div>

      {/* Contact & Support Section - 2 Col Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card p-8 rounded-3xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="text-indigo-600" size={24} />
              <h3 className="text-lg font-black text-slate-800">Direct Support</h3>
            </div>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
              If you couldn't find what you were looking for, our support team is available 24/7 via email and phone.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
              <p className="text-[0.6rem] font-black text-slate-400 uppercase tracking-widest mb-1">Email</p>
              <p className="text-xs font-bold text-indigo-600">support@finflow.io</p>
            </div>
            <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
              <p className="text-[0.6rem] font-black text-slate-400 uppercase tracking-widest mb-1">Phone</p>
              <p className="text-xs font-bold text-slate-800">+91 1800-FINFLOW</p>
            </div>
          </div>
        </div>

        <div className="card p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <ShieldCheck size={100} />
          </div>
          <h3 className="text-lg font-black mb-4 relative z-10">System Integrity</h3>
          <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6 relative z-10">
            FinFlow Pro v1.0 utilizes Gemini AI and microservices architecture to provide high-speed, secure financial processing.
          </p>
          <div className="flex items-center gap-4 relative z-10">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-indigo-500 flex items-center justify-center text-[10px] font-black">AI</div>
              <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-emerald-500 flex items-center justify-center text-[10px] font-black">SEC</div>
              <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-amber-500 flex items-center justify-center text-[10px] font-black">24/7</div>
            </div>
            <span className="text-[0.65rem] font-bold text-slate-400">Enterprise Grade Infrastructure</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
