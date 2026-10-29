import React, { useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CFormLabel,
  CFormInput,
  CButton,
  CSpinner,
  CAlert,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCloudDownload, cilCalendar } from '@coreui/icons';
import axiosInstance from '../../axiosInstance';

const getCurrentMonth = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
};

const KycBulkDownload = () => {
  const [month, setMonth] = useState(getCurrentMonth());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [downloadPct, setDownloadPct] = useState(0);

  const handleDownload = async () => {
    if (!month) {
      setError('Please select a month');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');
    setDownloadPct(0);

    try {
      // KEY POINTS:
      //   - responseType: 'blob'  → browser keeps bytes as a file
      //   - timeout: 0            → never abort due to client timeout
      //   - onDownloadProgress    → show real download progress
      const res = await axiosInstance.get('/kyc/bulk/download', {
        params: { month },
        responseType: 'blob',
        timeout: 0,
        onDownloadProgress: (e) => {
          if (e.total) {
            setDownloadPct(Math.round((e.loaded / e.total) * 100));
          }
        },
      });

      // Filename from Content-Disposition
      let filename = `kyc-bulk-${month}.zip`;
      const cd =
        res.headers?.['content-disposition'] ||
        res.headers?.['Content-Disposition'];
      if (cd) {
        const match = /filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i.exec(cd);
        if (match && match[1]) filename = decodeURIComponent(match[1]);
      }

      const contentType =
        res.headers?.['content-type'] || res.headers?.['Content-Type'] || '';
      if (!/\.(zip|pdf)$/i.test(filename)) {
        if (contentType.includes('pdf')) filename = `kyc-bulk-${month}.pdf`;
        else if (
          contentType.includes('zip') ||
          contentType.includes('octet-stream')
        )
          filename = `kyc-bulk-${month}.zip`;
      }

      const blob = new Blob([res.data], {
        type: contentType || 'application/octet-stream',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setSuccessMsg(`Downloaded successfully for ${month}`);
    } catch (err) {
      let msg = 'Failed to download KYC files';

      // If the server returned a JSON error inside a blob, decode it
      const data = err?.response?.data;
      if (data instanceof Blob) {
        try {
          const text = await data.text();
          const parsed = JSON.parse(text);
          msg = parsed.message || parsed.error || msg;
        } catch {
          /* not JSON */
        }
      } else if (data?.message || data?.error) {
        msg = data.message || data.error;
      } else if (err?.message) {
        msg = err.message;
      }

      if (err?.response?.status === 504) {
        msg =
          'The server took too long to prepare this month’s files (Gateway Timeout). Please try a smaller month or contact support.';
      }

      setError(msg);
    } finally {
      setLoading(false);
      setDownloadPct(0);
    }
  };

  const monthLabel = (() => {
    if (!month) return '';
    const [y, m] = month.split('-').map(Number);
    if (!y || !m) return month;
    return new Date(y, m - 1, 1).toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  })();

  return (
    <div>
      <div className="title">KYC Bulk Download</div>

      <CCard className="table-container mt-4">
        <CCardHeader className="card-header">
          <strong>Download KYC documents by month</strong>
        </CCardHeader>

        <CCardBody>
          {error && (
            <CAlert color="danger" className="mb-3" dismissible onClose={() => setError('')}>
              {error}
            </CAlert>
          )}
          {successMsg && (
            <CAlert color="success" className="mb-3" dismissible onClose={() => setSuccessMsg('')}>
              {successMsg}
            </CAlert>
          )}

          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <CFormLabel htmlFor="kycMonth">
                <CIcon icon={cilCalendar} className="me-1" />
                Select Month
              </CFormLabel>
              <CFormInput
                type="month"
                id="kycMonth"
                value={month}
                onChange={(e) => {
                  setMonth(e.target.value);
                  setError('');
                  setSuccessMsg('');
                }}
                max={getCurrentMonth()}
                disabled={loading}
              />
              {monthLabel && (
                <small className="text-muted d-block mt-1">
                  Will download KYC documents for <strong>{monthLabel}</strong>
                </small>
              )}
            </div>

            <div className="col-md-4">
              <CButton
                className="submit-button"
                onClick={handleDownload}
                disabled={loading || !month}
              >
                {loading ? (
                  <>
                    <CSpinner size="sm" className="me-2" />
                    {downloadPct > 0
                      ? `Downloading… ${downloadPct}%`
                      : 'Preparing on server…'}
                  </>
                ) : (
                  <>
                    <CIcon icon={cilCloudDownload} className="me-2" />
                    Download KYC Files
                  </>
                )}
              </CButton>
            </div>
          </div>

          {loading && (
            <div className="mt-3">
              <div className="progress" style={{ height: '10px' }}>
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  style={{ width: `${downloadPct || 5}%` }}
                  aria-valuenow={downloadPct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
              <small className="text-muted d-block mt-2">
                Large months can take several minutes to package on the server.
                Please keep this tab open.
              </small>
            </div>
          )}

          <div className="mt-4 text-muted" style={{ fontSize: '13px' }}>
            <strong>Note:</strong> The download may take a while for large months.
            A single archive containing all KYC documents for the selected month
            will be generated.
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default KycBulkDownload;