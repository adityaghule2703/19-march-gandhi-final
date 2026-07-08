import React, { useState, useEffect, useRef } from 'react';
import '../../css/table.css';
import '../../css/form.css';
import {
  axiosInstance,
  showError,
  showSuccess
} from '../../utils/tableImports';
import { 
  CButton, 
  CCard, 
  CCardBody, 
  CCardHeader, 
  CFormInput, 
  CFormLabel, 
  CTable, 
  CTableBody, 
  CTableHead, 
  CTableHeaderCell, 
  CTableRow,
  CTableDataCell,
  CSpinner,
  CBadge,
  CPagination,
  CPaginationItem,
  CFormSelect,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilSettings, 
  cilPlus,
  cilChevronLeft,
  cilChevronRight,
  cilOptions
} from '@coreui/icons';
import AddConfigModal from './AddConfigModal';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_LIMIT = 10;

const PurchaseOrderConfig = () => {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Server-side state
  const [alerts, setAlerts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: DEFAULT_LIMIT,
    totalCount: 0,
    totalPages: 1
  });
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const searchTimer = useRef(null);
  
  // Modal state
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);

  useEffect(() => {
    fetchAlerts();
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchAlerts(1, pagination.limit, searchTerm);
    }, 500);
    
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [searchTerm]);

  const fetchAlerts = async (page = pagination.page, limit = pagination.limit, search = searchTerm) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/low-stock/alerts-120day');
      let alertsData = response.data.data?.alerts || response.data.data || [];
      
      if (search && search.trim()) {
        alertsData = alertsData.filter(alert => 
          alert.modelName?.toLowerCase().includes(search.toLowerCase()) ||
          alert.colorName?.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      // Group by model
      const grouped = alertsData.reduce((acc, alert) => {
        if (!acc[alert.modelId]) {
          acc[alert.modelId] = {
            modelId: alert.modelId,
            modelName: alert.modelName,
            modelType: alert.modelType,
            colors: []
          };
        }
        acc[alert.modelId].colors.push(alert);
        return acc;
      }, {});
      
      const groupedList = Object.values(grouped);
      const start = (page - 1) * limit;
      const end = start + limit;
      
      setAlerts(groupedList.slice(start, end));
      setPagination({
        page: page,
        limit: limit,
        totalCount: groupedList.length,
        totalPages: Math.ceil(groupedList.length / limit)
      });
      
      setError(null);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setError(error.response?.data?.message || 'Failed to fetch alerts');
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLimitChange = (newLimit) => {
    setPagination(prev => ({ 
      ...prev, 
      limit: parseInt(newLimit, 10),
      page: 1
    }));
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const handleAddConfig = (model) => {
    setSelectedModel(model);
    setConfigModalVisible(true);
    setDropdownOpen(null);
  };

  const handleConfigSuccess = () => {
    fetchAlerts(1, pagination.limit, searchTerm);
  };

  const getAlertBadgeColor = (alertLevel) => {
    switch (alertLevel) {
      case 'CRITICAL': return 'danger';
      case 'HIGH': return 'warning';
      case 'MEDIUM': return 'info';
      default: return 'secondary';
    }
  };

  const getTrendBadgeColor = (trend) => {
    switch (trend) {
      case 'INCREASING': return 'success';
      case 'DECREASING': return 'danger';
      default: return 'secondary';
    }
  };

  const startRecord = (pagination.page - 1) * pagination.limit + 1;
  const endRecord = Math.min(pagination.page * pagination.limit, pagination.totalCount);

  let startPage = Math.max(1, pagination.page - 2);
  let endPage = Math.min(pagination.totalPages, pagination.page + 2);
  
  if (pagination.page <= 3) endPage = Math.min(5, pagination.totalPages);
  if (pagination.page >= pagination.totalPages - 2) startPage = Math.max(1, pagination.totalPages - 4);
  
  const displayedPages = [];
  for (let i = startPage; i <= endPage; i++) displayedPages.push(i);

  return (
    <div>
      <div className='title'>Purchase Order Configuration</div>
    
      <CCard className='table-container mt-4'>
        {/* <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            <h5 className="mb-0">120-Day Stock Alerts</h5>
          </div>
        </CCardHeader>              */}
        <CCardBody>
          <div className="d-flex justify-content-between mb-3 align-items-center">
            <div className="d-flex align-items-center">
             
            </div>
            <div className='d-flex align-items-center'>
              <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
              <CFormInput
                type="text"
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by model name..."
                style={{ width: '250px' }}
              />
            </div>
          </div>

          {loading && (
            <div className="d-flex align-items-center py-2 text-muted">
              <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
            </div>
          )}

          <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1 }}>
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Model Name</CTableHeaderCell>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Colors with Alerts</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {alerts.length === 0 && !loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan={5} className="text-center">
                      {searchTerm ? `No results found for "${searchTerm}"` : 'No alerts found.'}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  alerts.map((model, index) => {
                    const globalIndex = (pagination.page - 1) * pagination.limit + index + 1;
                    return (
                      <CTableRow key={model.modelId}>
                        <CTableDataCell>{globalIndex}</CTableDataCell>
                        <CTableDataCell><strong>{model.modelName}</strong></CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={model.modelType === 'EV' ? 'success' : 'primary'}>
                            {model.modelType}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          {model.colors.map((color, idx) => (
                            <div key={idx} className="mb-2">
                              <div className="d-flex align-items-center">
                                <CBadge color={getAlertBadgeColor(color.alertLevel)} className="me-2">
                                  {color.alertLevel}
                                </CBadge>
                                <span><strong>{color.colorName}</strong> - Stock: {color.currentStock}</span>
                              </div>
                              <small className="text-muted d-block mt-1">
                                Sold: {color.trendAnalysis?.totalSold120Days || 0} units | 
                                Trend: <CBadge color={getTrendBadgeColor(color.trendAnalysis?.trend)} size="sm">
                                  {color.trendAnalysis?.trend}
                                </CBadge> ({color.trendAnalysis?.trendPercentage}%)
                              </small>
                              <small className="text-muted d-block">{color.recommendations?.message}</small>
                            </div>
                          ))}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CDropdown>
                            <CDropdownToggle color="secondary" size="sm">
                              <CIcon icon={cilOptions} /> Options
                            </CDropdownToggle>
                            <CDropdownMenu>
                              <CDropdownItem onClick={() => handleAddConfig(model)}>
                                <CIcon icon={cilPlus} className="me-2" />
                                Add Config
                              </CDropdownItem>
                            </CDropdownMenu>
                          </CDropdown>
                        </CTableDataCell>
                      </CTableRow>
                    );
                  })
                )}
              </CTableBody>
            </CTable>
          </div>

          {pagination.totalCount > 0 && (
            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">
                  {loading ? 'Loading…' : `Showing ${startRecord}–${endRecord} of ${pagination.totalCount} records`}
                </span>
              </div>
              
              {pagination.totalPages > 1 && (
                <CPagination align="center">
                  <CPaginationItem onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1 || loading}>
                    <CIcon icon={cilChevronLeft} />
                  </CPaginationItem>
                  
                  {pagination.page > 3 && pagination.totalPages > 5 && (
                    <>
                      <CPaginationItem onClick={() => handlePageChange(1)} disabled={loading}>1</CPaginationItem>
                      {pagination.page > 4 && <CPaginationItem disabled>...</CPaginationItem>}
                    </>
                  )}
                  
                  {displayedPages.map(page => (
                    <CPaginationItem key={page} onClick={() => handlePageChange(page)} active={pagination.page === page} disabled={loading}>
                      {page}
                    </CPaginationItem>
                  ))}
                  
                  {pagination.page < pagination.totalPages - 2 && pagination.totalPages > 5 && (
                    <>
                      {pagination.page < pagination.totalPages - 3 && <CPaginationItem disabled>...</CPaginationItem>}
                      <CPaginationItem onClick={() => handlePageChange(pagination.totalPages)} disabled={loading}>
                        {pagination.totalPages}
                      </CPaginationItem>
                    </>
                  )}
                  
                  <CPaginationItem onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.totalPages || loading}>
                    <CIcon icon={cilChevronRight} />
                  </CPaginationItem>
                </CPagination>
              )}
            </div>
          )}
        </CCardBody>
      </CCard>

      <AddConfigModal
        visible={configModalVisible}
        onClose={() => setConfigModalVisible(false)}
        model={selectedModel}
        onSuccess={handleConfigSuccess}
      />
    </div>
  );
};

export default PurchaseOrderConfig;



// import React, { useState, useEffect, useRef } from 'react';
// import '../../css/table.css';
// import '../../css/form.css';
// import {
//   axiosInstance,
//   showError,
//   showSuccess
// } from '../../utils/tableImports';
// import { 
//   CButton, 
//   CCard, 
//   CCardBody, 
//   CCardHeader, 
//   CFormInput, 
//   CFormLabel, 
//   CTable, 
//   CTableBody, 
//   CTableHead, 
//   CTableHeaderCell, 
//   CTableRow,
//   CTableDataCell,
//   CSpinner,
//   CBadge,
//   CPagination,
//   CPaginationItem,
//   CFormSelect,
//   CDropdown,
//   CDropdownToggle,
//   CDropdownMenu,
//   CDropdownItem
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { 
//   cilSettings, 
//   cilPlus,
//   cilChevronLeft,
//   cilChevronRight,
//   cilOptions
// } from '@coreui/icons';
// import AddConfigModal from './AddConfigModal';
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   ACTIONS,
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage,
//   canDeleteInPage 
// } from '../../utils/modulePermissions';
// import { useAuth } from '../../context/AuthContext';

// const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
// const DEFAULT_LIMIT = 10;

// const PurchaseOrderConfig = () => {
//   const [dropdownOpen, setDropdownOpen] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Server-side state
//   const [alerts, setAlerts] = useState([]);
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: DEFAULT_LIMIT,
//     totalCount: 0,
//     totalPages: 1
//   });
  
//   // Search state
//   const [searchTerm, setSearchTerm] = useState('');
//   const searchTimer = useRef(null);
  
//   // Modal state
//   const [configModalVisible, setConfigModalVisible] = useState(false);
//   const [selectedModel, setSelectedModel] = useState(null);

//   const { permissions = [] } = useAuth();

//   // Permission checks for Purchase module - Purchase Order Config page
//   // Using PAGES.PURCHASE constants for page-level permissions
//   const canViewPurchaseOrderConfig = canViewPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.PURCHASE_ORDER_CONFIG);
//   const canCreatePurchaseOrderConfig = canCreateInPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.PURCHASE_ORDER_CONFIG);
  
//   // Also check using hasSafePagePermission for more granular control
//   const hasCreatePermission = hasSafePagePermission(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.PURCHASE_ORDER_CONFIG, 
//     ACTIONS.CREATE
//   );
  
//   // Combined permission check for create action
//   const canPerformCreate = canCreatePurchaseOrderConfig || hasCreatePermission;

//   useEffect(() => {
//     if (canViewPurchaseOrderConfig) {
//       fetchAlerts();
//     }
//   }, [pagination.page, pagination.limit]);

//   useEffect(() => {
//     if (!canViewPurchaseOrderConfig) return;
    
//     if (searchTimer.current) clearTimeout(searchTimer.current);
//     searchTimer.current = setTimeout(() => {
//       setPagination(prev => ({ ...prev, page: 1 }));
//       fetchAlerts(1, pagination.limit, searchTerm);
//     }, 500);
    
//     return () => {
//       if (searchTimer.current) clearTimeout(searchTimer.current);
//     };
//   }, [searchTerm]);

//   const fetchAlerts = async (page = pagination.page, limit = pagination.limit, search = searchTerm) => {
//     // Check if user has permission to view purchase order config
//     if (!canViewPurchaseOrderConfig) {
//       setError('You do not have permission to view Purchase Order Config');
//       setLoading(false);
//       return;
//     }
    
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get('/low-stock/alerts-120day');
//       let alertsData = response.data.data?.alerts || response.data.data || [];
      
//       if (search && search.trim()) {
//         alertsData = alertsData.filter(alert => 
//           alert.modelName?.toLowerCase().includes(search.toLowerCase()) ||
//           alert.colorName?.toLowerCase().includes(search.toLowerCase())
//         );
//       }
      
//       // Group by model
//       const grouped = alertsData.reduce((acc, alert) => {
//         if (!acc[alert.modelId]) {
//           acc[alert.modelId] = {
//             modelId: alert.modelId,
//             modelName: alert.modelName,
//             modelType: alert.modelType,
//             colors: []
//           };
//         }
//         acc[alert.modelId].colors.push(alert);
//         return acc;
//       }, {});
      
//       const groupedList = Object.values(grouped);
//       const start = (page - 1) * limit;
//       const end = start + limit;
      
//       setAlerts(groupedList.slice(start, end));
//       setPagination({
//         page: page,
//         limit: limit,
//         totalCount: groupedList.length,
//         totalPages: Math.ceil(groupedList.length / limit)
//       });
      
//       setError(null);
//     } catch (error) {
//       console.error('Error fetching alerts:', error);
//       setError(error.response?.data?.message || 'Failed to fetch alerts');
//       showError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage < 1 || newPage > pagination.totalPages) return;
//     setPagination(prev => ({ ...prev, page: newPage }));
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleLimitChange = (newLimit) => {
//     setPagination(prev => ({ 
//       ...prev, 
//       limit: parseInt(newLimit, 10),
//       page: 1
//     }));
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//   };

//   const toggleDropdown = (id) => {
//     setDropdownOpen(dropdownOpen === id ? null : id);
//   };

//   const handleAddConfig = (model) => {
//     // Check create permission before opening add config modal
//     if (!canPerformCreate) {
//       showError('You do not have permission to add purchase order configurations');
//       return;
//     }
//     setSelectedModel(model);
//     setConfigModalVisible(true);
//     setDropdownOpen(null);
//   };

//   const handleConfigSuccess = () => {
//     fetchAlerts(1, pagination.limit, searchTerm);
//   };

//   const getAlertBadgeColor = (alertLevel) => {
//     switch (alertLevel) {
//       case 'CRITICAL': return 'danger';
//       case 'HIGH': return 'warning';
//       case 'MEDIUM': return 'info';
//       default: return 'secondary';
//     }
//   };

//   const getTrendBadgeColor = (trend) => {
//     switch (trend) {
//       case 'INCREASING': return 'success';
//       case 'DECREASING': return 'danger';
//       default: return 'secondary';
//     }
//   };

//   const startRecord = (pagination.page - 1) * pagination.limit + 1;
//   const endRecord = Math.min(pagination.page * pagination.limit, pagination.totalCount);

//   let startPage = Math.max(1, pagination.page - 2);
//   let endPage = Math.min(pagination.totalPages, pagination.page + 2);
  
//   if (pagination.page <= 3) endPage = Math.min(5, pagination.totalPages);
//   if (pagination.page >= pagination.totalPages - 2) startPage = Math.max(1, pagination.totalPages - 4);
  
//   const displayedPages = [];
//   for (let i = startPage; i <= endPage; i++) displayedPages.push(i);

//   // If user doesn't have permission to view purchase order config, show access denied message
//   if (!canViewPurchaseOrderConfig) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Purchase Order Config.
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className='title'>Purchase Order Configuration</div>
    
//       <CCard className='table-container mt-4'>
//         <CCardBody>
//           <div className="d-flex justify-content-between mb-3 align-items-center">
//             <div className="d-flex align-items-center">
//               {/* Additional header content can go here */}
//             </div>
//             <div className='d-flex align-items-center'>
//               <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//               <CFormInput
//                 type="text"
//                 className="d-inline-block square-search"
//                 value={searchTerm}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 placeholder="Search by model name..."
//                 style={{ width: '250px' }}
//               />
//             </div>
//           </div>

//           {loading && (
//             <div className="d-flex align-items-center py-2 text-muted">
//               <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
//             </div>
//           )}

//           <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1 }}>
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Model Name</CTableHeaderCell>
//                   <CTableHeaderCell>Type</CTableHeaderCell>
//                   <CTableHeaderCell>Colors with Alerts</CTableHeaderCell>
//                   <CTableHeaderCell>Action</CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {alerts.length === 0 && !loading ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan={5} className="text-center">
//                       {searchTerm ? `No results found for "${searchTerm}"` : 'No alerts found.'}
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   alerts.map((model, index) => {
//                     const globalIndex = (pagination.page - 1) * pagination.limit + index + 1;
//                     return (
//                       <CTableRow key={model.modelId}>
//                         <CTableDataCell>{globalIndex}</CTableDataCell>
//                         <CTableDataCell><strong>{model.modelName}</strong></CTableDataCell>
//                         <CTableDataCell>
//                           <CBadge color={model.modelType === 'EV' ? 'success' : 'primary'}>
//                             {model.modelType}
//                           </CBadge>
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {model.colors.map((color, idx) => (
//                             <div key={idx} className="mb-2">
//                               <div className="d-flex align-items-center">
//                                 <CBadge color={getAlertBadgeColor(color.alertLevel)} className="me-2">
//                                   {color.alertLevel}
//                                 </CBadge>
//                                 <span><strong>{color.colorName}</strong> - Stock: {color.currentStock}</span>
//                               </div>
//                               <small className="text-muted d-block mt-1">
//                                 Sold: {color.trendAnalysis?.totalSold120Days || 0} units | 
//                                 Trend: <CBadge color={getTrendBadgeColor(color.trendAnalysis?.trend)} size="sm">
//                                   {color.trendAnalysis?.trend}
//                                 </CBadge> ({color.trendAnalysis?.trendPercentage}%)
//                               </small>
//                               <small className="text-muted d-block">{color.recommendations?.message}</small>
//                             </div>
//                           ))}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           <CDropdown>
//                             <CDropdownToggle color="secondary" size="sm">
//                               <CIcon icon={cilOptions} /> Options
//                             </CDropdownToggle>
//                             <CDropdownMenu>
//                               {/* Add Config option - requires CREATE permission */}
//                               {canPerformCreate && (
//                                 <CDropdownItem onClick={() => handleAddConfig(model)}>
//                                   <CIcon icon={cilPlus} className="me-2" />
//                                   Add Config
//                                 </CDropdownItem>
//                               )}
//                               {!canPerformCreate && (
//                                 <CDropdownItem disabled>
//                                   <CIcon icon={cilPlus} className="me-2" />
//                                   Add Config (No Permission)
//                                 </CDropdownItem>
//                               )}
//                             </CDropdownMenu>
//                           </CDropdown>
//                         </CTableDataCell>
//                       </CTableRow>
//                     );
//                   })
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>

//           {pagination.totalCount > 0 && (
//             <div className="mt-4">
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <span className="text-muted">
//                   {loading ? 'Loading…' : `Showing ${startRecord}–${endRecord} of ${pagination.totalCount} records`}
//                 </span>
//               </div>
              
//               {pagination.totalPages > 1 && (
//                 <CPagination align="center">
//                   <CPaginationItem onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1 || loading}>
//                     <CIcon icon={cilChevronLeft} />
//                   </CPaginationItem>
                  
//                   {pagination.page > 3 && pagination.totalPages > 5 && (
//                     <>
//                       <CPaginationItem onClick={() => handlePageChange(1)} disabled={loading}>1</CPaginationItem>
//                       {pagination.page > 4 && <CPaginationItem disabled>...</CPaginationItem>}
//                     </>
//                   )}
                  
//                   {displayedPages.map(page => (
//                     <CPaginationItem key={page} onClick={() => handlePageChange(page)} active={pagination.page === page} disabled={loading}>
//                       {page}
//                     </CPaginationItem>
//                   ))}
                  
//                   {pagination.page < pagination.totalPages - 2 && pagination.totalPages > 5 && (
//                     <>
//                       {pagination.page < pagination.totalPages - 3 && <CPaginationItem disabled>...</CPaginationItem>}
//                       <CPaginationItem onClick={() => handlePageChange(pagination.totalPages)} disabled={loading}>
//                         {pagination.totalPages}
//                       </CPaginationItem>
//                     </>
//                   )}
                  
//                   <CPaginationItem onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.totalPages || loading}>
//                     <CIcon icon={cilChevronRight} />
//                   </CPaginationItem>
//                 </CPagination>
//               )}
//             </div>
//           )}
//         </CCardBody>
//       </CCard>

//       {/* Add Config Modal - only shown if user has create permission */}
//       {canPerformCreate && (
//         <AddConfigModal
//           visible={configModalVisible}
//           onClose={() => setConfigModalVisible(false)}
//           model={selectedModel}
//           onSuccess={handleConfigSuccess}
//         />
//       )}
//     </div>
//   );
// };

// export default PurchaseOrderConfig;