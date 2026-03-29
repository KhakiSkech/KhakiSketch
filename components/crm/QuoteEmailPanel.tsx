'use client';

import { useState, useEffect } from 'react';
import { getLeadQuoteEmails, createQuoteEmail } from '@/lib/firestore-quotes';
import Toast from '@/components/ui/Toast';
import type { QuoteEmail, QuoteEmailItem, QuoteLead } from '@/types/admin';

interface QuoteEmailPanelProps {
  lead: QuoteLead;
  userEmail: string;
}

export default function QuoteEmailPanel({ lead, userEmail }: QuoteEmailPanelProps): React.ReactElement {
  const [emails, setEmails] = useState<QuoteEmail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    subject: `[견적서] ${lead.projectName || lead.projectType} - Khaki Sketch`,
    content: `안녕하세요, ${lead.customerName}님.

${lead.projectName || lead.projectType}에 대한 견적서를 별첨과 같이 별내드립니다.

검토하신 후 회신 주시면 감사하겠습니다.

감사합니다.
Khaki Sketch 드림`,
    items: [
      { description: 'Discovery 세션 (요구사항 정의)', quantity: 1, unitPrice: 250000, total: 250000 },
      { description: 'MVP 개발', quantity: 1, unitPrice: 8000000, total: 8000000 },
    ] as QuoteEmailItem[],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    taxRate: 10,
  });

  useEffect(() => {
    loadEmails();
  }, [lead.id]);

  const loadEmails = async () => {
    setIsLoading(true);
    const result = await getLeadQuoteEmails(lead.id);
    if (result.success && result.data) {
      setEmails(result.data);
    }
    setIsLoading(false);
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = Math.round(subtotal * (formData.taxRate / 100));
    const grandTotal = subtotal + taxAmount;
    return { subtotal, taxAmount, grandTotal };
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unitPrice: 0, total: 0 }],
    });
  };

  const updateItem = (index: number, field: keyof QuoteEmailItem, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }
    
    setFormData({ ...formData, items: newItems });
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleCreate = async () => {
    if (formData.items.length === 0 || formData.items.some(i => !i.description)) {
      setToast({ message: '견적 항목을 입력해주세요.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    const { subtotal, taxAmount, grandTotal } = calculateTotals();
    
    const result = await createQuoteEmail({
      leadId: lead.id,
      subject: formData.subject,
      content: formData.content,
      items: formData.items,
      totalAmount: subtotal,
      taxAmount,
      grandTotal,
      validUntil: formData.validUntil,
      status: 'DRAFT',
      createdBy: userEmail,
    });

    if (result.success) {
      setShowCreateForm(false);
      setPreviewMode(false);
      await loadEmails();
    } else {
      setToast({ message: result.error || '견적서 생성에 실패했습니다.', type: 'error' });
    }
    setIsSubmitting(false);
  };

  const handlePrint = (email: QuoteEmail) => {
    // 인쇄용 새 창 열기
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setToast({ message: '팝업이 차단되었습니다. 팝업 차단을 해제해주세요.', type: 'error' });
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>견적서 - ${lead.customerName}</title>
        <style>
          @media print {
            body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          }
          body { 
            font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif; 
            line-height: 1.6; 
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
          }
          .header { 
            text-align: center; 
            border-bottom: 3px solid #263122; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
          }
          .header h1 { 
            color: #263122; 
            font-size: 28px; 
            margin: 0;
          }
          .company-info {
            text-align: right;
            color: #666;
            font-size: 14px;
            margin-bottom: 30px;
          }
          .info-section { 
            margin: 20px 0; 
            padding: 20px;
            background: #f9f9f9;
            border-radius: 8px;
          }
          .info-section h3 {
            color: #263122;
            margin-top: 0;
            border-left: 4px solid #749965;
            padding-left: 10px;
          }
          .info-row { 
            margin: 8px 0; 
            display: flex;
          }
          .label { 
            font-weight: bold; 
            color: #263122; 
            width: 120px;
            flex-shrink: 0;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0;
          }
          th { 
            background: #263122; 
            color: white; 
            padding: 12px; 
            text-align: left;
          }
          td { 
            padding: 12px; 
            border-bottom: 1px solid #ddd; 
          }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .total-section {
            margin-top: 20px;
            padding: 20px;
            background: #263122;
            color: white;
            border-radius: 8px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
          }
          .grand-total {
            font-size: 20px;
            font-weight: bold;
            border-top: 2px solid rgba(255,255,255,0.3);
            padding-top: 10px;
            margin-top: 10px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #666;
            font-size: 14px;
          }
          .valid-until {
            text-align: right;
            color: #dc2626;
            font-weight: bold;
            margin: 20px 0;
          }
          .notes {
            margin-top: 30px;
            padding: 20px;
            background: #fef3c7;
            border-radius: 8px;
            border-left: 4px solid #f59e0b;
          }
          .notes h4 {
            margin-top: 0;
            color: #92400e;
          }
          .notes pre {
            white-space: pre-wrap;
            font-family: inherit;
            margin: 0;
          }
          @media print {
            .no-print { display: none; }
            body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>견 적 서</h1>
          <p>Quotation</p>
        </div>
        
        <div class="company-info">
          <strong>Khaki Sketch</strong><br>
          견적일: ${new Date().toLocaleDateString('ko-KR')}<br>
          견적번호: ${email.id.slice(-8).toUpperCase()}
        </div>

        <div class="valid-until">
          유효기간: ${email.validUntil ? new Date(email.validUntil).toLocaleDateString('ko-KR') : '미정'}까지
        </div>
        
        <div class="info-section">
          <h3>고객 정보</h3>
          <div class="info-row">
            <span class="label">회사명:</span>
            <span>${lead.company || '-'}</span>
          </div>
          <div class="info-row">
            <span class="label">담당자:</span>
            <span>${lead.customerName}</span>
          </div>
          <div class="info-row">
            <span class="label">이메일:</span>
            <span>${lead.email}</span>
          </div>
          <div class="info-row">
            <span class="label">연락처:</span>
            <span>${lead.phone}</span>
          </div>
          <div class="info-row">
            <span class="label">프로젝트:</span>
            <span>${lead.projectName || lead.projectType}</span>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>품목</th>
              <th class="text-center">수량</th>
              <th class="text-right">단가</th>
              <th class="text-right">금액</th>
            </tr>
          </thead>
          <tbody>
            ${email.items.map((item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.description}</td>
                <td class="text-center">${item.quantity}</td>
                <td class="text-right">${item.unitPrice.toLocaleString('ko-KR')}원</td>
                <td class="text-right">${item.total.toLocaleString('ko-KR')}원</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="total-section">
          <div class="total-row">
            <span>소계</span>
            <span>${email.totalAmount.toLocaleString('ko-KR')}원</span>
          </div>
          <div class="total-row">
            <span>부가세 (10%)</span>
            <span>${(email.taxAmount || 0).toLocaleString('ko-KR')}원</span>
          </div>
          <div class="total-row grand-total">
            <span>총 견적금액 (VAT 포함)</span>
            <span>${email.grandTotal.toLocaleString('ko-KR')}원</span>
          </div>
        </div>

        <div class="notes">
          <h4>견적 조건 및 참고사항</h4>
          <pre>${email.content}</pre>
        </div>
        
        <div class="footer">
          <p><strong>Khaki Sketch</strong></p>
          <p>웹사이트: khakisketch.co.kr | 이메일: songjc6561@gmail.com</p>
          <p style="margin-top: 20px; font-size: 12px; color: #999;">
            본 견적서는 ${email.validUntil ? new Date(email.validUntil).toLocaleDateString('ko-KR') : '미정'}까지 유효합니다.<br>
            이후에는 재견적이 필요할 수 있습니다.
          </p>
        </div>

        <div class="no-print" style="margin-top: 40px; text-align: center; padding: 20px; background: #f3f4f6; border-radius: 8px;">
          <p style="margin-bottom: 15px;">💡 <strong>팁:</strong> Ctrl+P (또는 Cmd+P)를 눌러 PDF로 저장하거나 인쇄할 수 있습니다.</p>
          <button onclick="window.print()" style="padding: 12px 24px; background: #263122; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;">
            🖨️ 인쇄 / PDF 저장
          </button>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { text: string; color: string }> = {
      DRAFT: { text: '임시저장', color: 'bg-gray-100 text-gray-600' },
      SENT: { text: '발송됨', color: 'bg-blue-100 text-blue-700' },
      VIEWED: { text: '엿봄', color: 'bg-purple-100 text-purple-700' },
      ACCEPTED: { text: '수락됨', color: 'bg-green-100 text-green-700' },
      REJECTED: { text: '거절됨', color: 'bg-red-100 text-red-700' },
    };
    return labels[status] || { text: status, color: 'bg-gray-100' };
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-20 bg-brand-bg rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Create Button */}
      {!showCreateForm && (
        <button
          onClick={() => setShowCreateForm(true)}
          className="w-full p-4 border-2 border-dashed border-brand-primary/20 rounded-xl hover:border-brand-secondary/50 transition-colors text-center"
        >
          <div className="flex flex-col items-center gap-2 text-brand-muted">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>새 견적서 작성</span>
          </div>
        </button>
      )}

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white rounded-xl border border-brand-primary/10 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-brand-primary">{previewMode ? '견적서 미리보기' : '새 견적서'}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="px-3 py-1.5 text-sm bg-brand-bg rounded-lg hover:bg-brand-primary/5"
              >
                {previewMode ? '수정' : '미리보기'}
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setPreviewMode(false);
                }}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {previewMode ? (
            /* Preview Mode */
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div className="text-center border-b pb-4">
                <h2 className="text-xl font-bold text-brand-primary">견 적 서</h2>
                <p className="text-sm text-brand-muted mt-1">
                  유효기간: {formData.validUntil}
                </p>
              </div>

              <div className="space-y-2">
                <p><strong>수신:</strong> {lead.customerName} ({lead.email})</p>
                <p><strong>제목:</strong> {formData.subject}</p>
                <pre className="whitespace-pre-wrap text-sm text-brand-muted bg-white p-3 rounded">{formData.content}</pre>
              </div>

              <table className="w-full text-sm">
                <thead className="bg-brand-primary/5">
                  <tr>
                    <th className="text-left p-2">품목</th>
                    <th className="text-center p-2">수량</th>
                    <th className="text-right p-2">단가</th>
                    <th className="text-right p-2">금액</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-2">{item.description}</td>
                      <td className="text-center p-2">{item.quantity}</td>
                      <td className="text-right p-2">{formatPrice(item.unitPrice)}</td>
                      <td className="text-right p-2">{formatPrice(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="font-medium">
                  <tr>
                    <td colSpan={3} className="text-right p-2">소계</td>
                    <td className="text-right p-2">{formatPrice(calculateTotals().subtotal)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="text-right p-2">부가세 ({formData.taxRate}%)</td>
                    <td className="text-right p-2">{formatPrice(calculateTotals().taxAmount)}</td>
                  </tr>
                  <tr className="text-lg font-bold text-brand-primary">
                    <td colSpan={3} className="text-right p-2">총계</td>
                    <td className="text-right p-2">{formatPrice(calculateTotals().grandTotal)}</td>
                  </tr>
                </tfoot>
              </table>

              <button
                onClick={handleCreate}
                disabled={isSubmitting}
                className="w-full py-3 bg-brand-primary text-white rounded-xl font-medium hover:bg-brand-primary/90 disabled:opacity-50"
              >
                {isSubmitting ? '저장 중...' : '견적서 저장'}
              </button>
            </div>
          ) : (
            /* Edit Mode */
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">제목</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-brand-primary/10 focus:outline-none focus:border-brand-secondary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">내용</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-brand-primary/10 focus:outline-none focus:border-brand-secondary resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">견적 항목</label>
                <div className="space-y-2">
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <input
                        type="text"
                        placeholder="품목명"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-brand-primary/10 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="수량"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-20 px-3 py-2 rounded-lg border border-brand-primary/10 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="단가"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', parseInt(e.target.value) || 0)}
                        className="w-28 px-3 py-2 rounded-lg border border-brand-primary/10 text-sm"
                      />
                      <div className="w-28 px-3 py-2 bg-brand-bg rounded-lg text-sm text-right">
                        {formatPrice(item.total)}
                      </div>
                      <button
                        onClick={() => removeItem(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addItem}
                  className="mt-2 text-sm text-brand-secondary hover:text-brand-primary font-medium"
                >
                  + 항목 추가
                </button>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">유효기간</label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-brand-primary/10"
                  />
                </div>
                <div className="w-32">
                  <label className="block text-sm font-medium mb-1">부가세 (%)</label>
                  <input
                    type="number"
                    value={formData.taxRate}
                    onChange={(e) => setFormData({ ...formData, taxRate: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg border border-brand-primary/10"
                  />
                </div>
              </div>

              <div className="bg-brand-bg p-3 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>소계</span>
                  <span>{formatPrice(calculateTotals().subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>부가세</span>
                  <span>{formatPrice(calculateTotals().taxAmount)}</span>
                </div>
                <div className="flex justify-between font-bold text-brand-primary mt-2 pt-2 border-t">
                  <span>총계</span>
                  <span>{formatPrice(calculateTotals().grandTotal)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Email List */}
      {emails.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-brand-muted">견적서 이력 ({emails.length})</h4>
          {emails.map((email) => {
            const status = getStatusLabel(email.status);
            return (
              <div
                key={email.id}
                className="p-4 bg-white rounded-xl border border-brand-primary/10 hover:border-brand-secondary/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-brand-text">{email.subject}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 text-xs rounded ${status.color}`}>{status.text}</span>
                      <span className="text-xs text-brand-muted">
                        {new Date(email.createdAt).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    <p className="text-sm text-brand-primary font-medium mt-2">
                      {formatPrice(email.grandTotal)}
                    </p>
                  </div>

                  <button
                    onClick={() => handlePrint(email)}
                    className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90"
                  >
                    인쇄 / PDF 저장
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
