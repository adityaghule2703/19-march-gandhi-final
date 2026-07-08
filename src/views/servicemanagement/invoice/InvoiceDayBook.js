import React, { useState, useEffect } from 'react';
import '../../../css/form.css';
import { CInputGroup, CInputGroupText, CFormInput, CFormSelect, CButton } from '@coreui/react';
import tvsLogo from '../../../assets/images/logo.png';
import tvssangamner from '../../../assets/images/tvssangamner.png';
import CIcon from '@coreui/icons-react';
import { cilLocationPin, cilSearch } from '@coreui/icons';
import { showFormSubmitError, showFormSubmitToast } from '../../../utils/sweetAlerts';
import axiosInstance from '../../../axiosInstance';
import { useAuth } from '../../../context/AuthContext';
import { canViewPage, MODULES, PAGES } from '../../../utils/modulePermissions';

const InvoiceDayBook = () => {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const hasBranch = !!storedUser.branch?._id;
  const [formData, setFormData] = useState({
    branchId: hasBranch ? storedUser.branch?._id : '',
    date: ''
  });
  const [errors, setErrors] = useState({});
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { permissions } = useAuth();
  
  // Page-level permission check
  const canViewDayBook = canViewPage(permissions, MODULES.FUND_MANAGEMENT, PAGES.FUND_MANAGEMENT.DAY_BOOK);

  useEffect(() => {
    if (!canViewDayBook) {
      showFormSubmitError('You do not have permission to view Day Book');
      return;
    }
    
    const fetchBranches = async () => {
      try {
        const response = await axiosInstance.get('/branches');
        setBranches(response.data.data || []);
      } catch (error) {
        console.error('Error fetching branches:', error);
        showFormSubmitError(error);
      }
    };

    fetchBranches();
  }, [canViewDayBook]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const generateDayBook = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `/invoices/reports/day-book?branchId=${formData.branchId}&date=${formData.date}`
      );

      if (response.data.success) {
        const dayBookData = response.data.data;
        const selectedBranch = branches.find((b) => b._id === formData.branchId) || {};

        const dayBookWindow = window.open('', '_blank');

        // Map the API response to match the day book format
        const entries = dayBookData.entries || [];
        
        // Calculate running balance for display
        let runningBalance = dayBookData.openingBalance || 0;
        const processedEntries = entries.map((entry) => {
          if (entry.invoiceNo === 'Opening Balance') {
            return { ...entry, runningBalance: runningBalance };
          } else if (entry.invoiceNo === 'Closing Balance') {
            return { ...entry, runningBalance: dayBookData.closingBalance };
          } else {
            // For regular entries, update running balance
            if (entry.debit && entry.debit > 0) {
              runningBalance += entry.debit;
            } else if (entry.credit && entry.credit > 0) {
              runningBalance -= entry.credit;
            }
            return { ...entry, runningBalance: runningBalance };
          }
        });

        const dayBookHTML = `
          <html>
            <head>
              <title>Day Book - ${selectedBranch.name || ''} - ${formData.date}</title>
              <style>
                @page {
                  size: A4;
                  margin: 10mm;
                }
                body {
                  font-family: Courier New;
                  width: 210mm;
                  margin: 0 auto;
                  padding: 10mm;
                }
                .header-container {
                  margin-bottom: 10px;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                }
                .logo-left {
                  width: 30mm;
                  height: auto;
                }
                .logo-right {
                  width: 30mm;
                  height: auto;
                }
                .header-text {
                  flex-grow: 1;
                }
                .header-text h1 {
                  margin: 0;
                  font-size: 24px;
                }
                .header-text p {
                  margin: 2px 0;
                  font-size: 14px;
                }
                .header2 {
                  display: flex;
                  justify-content: space-between;
                  border-top: 2px solid #AAAAAA;
                  padding-top: 5px;
                  margin: 5px 0 15px 0;
                }
                .header2 div {
                  margin: 0;
                }
                .header2 h4 {
                  margin: 0 0 5px 0;
                }
                .header2 p {
                  margin: 0;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 15px 0;
                  font-size: 14px;
                }
                th, td {
                  border: 1px solid #000;
                  padding: 6px;
                  text-align: left;
                }
                th {
                  background-color: #f2f2f2;
                  text-align: center;
                }
                .total-row {
                  font-weight: bold;
                }
                .signature {
                  text-align: right;
                  margin-top: 10px;
                }
                .balance {
                  font-weight: bold;
                  color: red;
                }
                .text-right {
                  text-align: right;
                }
                .text-center {
                  text-align: center;
                }
                .opening-row {
                  background-color: #f0f8ff;
                }
                .closing-row {
                  background-color: #f0f8ff;
                  font-weight: bold;
                }
              </style>
            </head>
            <body>
              <div class="header-container">
                <div>
                  <img src="${tvsLogo}" class="logo-left" alt="TVS Logo">
                  <div class="header-text">
                    <h1>GANDHI TVS</h1>
                    <p>Authorised Main Dealer: TVS Motor Company Ltd.</p>
                    <p>Registered office:</p>
                  </div>
                </div>
                <div>
                  <img src="${tvssangamner}" class="logo-right" alt="TVS Logo">
                </div>
              </div>

              <div class="header2">
                <div>
                  <h4>DAY BOOK</h4>
                  <p>Location: ${selectedBranch.name || ''}</p>
                </div>
                <div>
                  <p>Ledger Date: ${new Date(formData.date).toLocaleDateString('en-IN')}</p>
                </div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Invoice No</th>
                    <th>Account Head</th>
                    <th>Debit</th>
                    <th>Credit</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  ${processedEntries.map((entry) => {
                    let rowClass = '';
                    if (entry.invoiceNo === 'Opening Balance') rowClass = 'opening-row';
                    else if (entry.invoiceNo === 'Closing Balance') rowClass = 'closing-row';
                    
                    return `
                      <tr class="${rowClass}">
                        <td>${entry.invoiceNo || '-'}</td>
                        <td>${entry.accountHead || '-'}</td>
                        <td class="text-right">${entry.debit ? entry.debit.toLocaleString('en-IN') : '-'}</td>
                        <td class="text-right">${entry.credit ? entry.credit.toLocaleString('en-IN') : '-'}</td>
                        <td class="text-right ${entry.invoiceNo === 'Closing Balance' ? 'balance' : ''}">
                          ${entry.runningBalance !== undefined ? entry.runningBalance.toLocaleString('en-IN') : '-'}
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>

              <div class="signature">
                <p>For, Gandhi TVS</p>
                <p>Authorised Signatory</p>
              </div>
            </body>
          </html>
        `;

        dayBookWindow.document.open();
        dayBookWindow.document.write(dayBookHTML);
        dayBookWindow.document.close();
      } else {
        showFormSubmitToast('No data found for the selected branch and date');
      }
    } catch (error) {
      console.error('Error generating day book:', error);
      showFormSubmitError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};

    if (!formData.branchId) formErrors.branchId = 'This field is required';
    if (!formData.date) formErrors.date = 'This field is required';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    await generateDayBook();
  };

  if (!canViewDayBook) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Day Book.
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="title">Invoice Day Book</div>
      <div className="form-card">
        <div className="form-body">
          <form onSubmit={handleSubmit}>
            <div className="user-details">
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Location</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilLocationPin} />
                  </CInputGroupText>
                  <CFormSelect name="branchId" value={formData.branchId} onChange={handleChange} disabled={isLoading}>
                    <option value="">-Select-</option>
                    {branches.map((branch) => (
                      <option key={branch._id} value={branch._id}>
                        {branch.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CInputGroup>
                {errors.branchId && <p className="error">{errors.branchId}</p>}
              </div>
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Date</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilSearch} />
                  </CInputGroupText>
                  <CFormInput type="date" name="date" value={formData.date} onChange={handleChange} disabled={isLoading} />
                </CInputGroup>
                {errors.date && <p className="error">{errors.date}</p>}
              </div>
              <div className="button-container">
                <CButton className='submit-button' type="submit" disabled={isLoading}>
                  {isLoading ? 'Searching...' : 'Search'}
                </CButton>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDayBook;