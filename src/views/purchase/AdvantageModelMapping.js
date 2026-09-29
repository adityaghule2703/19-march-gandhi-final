

// import '../../css/table.css';
// import '../../css/form.css';
// import {
//   React,
//   useState,
//   useEffect,
//   getDefaultSearchFields,
//   useTableFilter,
//   confirmDelete,
//   showError,
//   showSuccess,
//   axiosInstance
// } from '../../utils/tableImports';
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
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CFormSelect,
//   CFormTextarea,
//   CAlert,
//   CPagination,
//   CPaginationItem,
//   CNav,
//   CNavItem,
//   CNavLink,
//   CDropdown,
//   CDropdownToggle,
//   CDropdownMenu,
//   CDropdownItem
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import {
//   cilPlus,
//   cilSearch,
//   cilSettings,
//   cilPencil,
//   cilTrash,
//   cilCloudDownload,
//   cilCloudUpload,
//   cilCheckCircle,
//   cilWarning,
//   cilChevronLeft,
//   cilChevronRight
// } from '@coreui/icons';
// import { useNavigate } from 'react-router-dom';
// import { useRef } from 'react';

// const PAGE_SIZE_OPTIONS = [25, 50, 100];
// const DEFAULT_LIMIT = 25;

// const AdvantageModelMapping = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Server-side state
//   const [mappings, setMappings] = useState([]);
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: DEFAULT_LIMIT,
//     total: 0,
//     pages: 1
//   });

//   // Search / filter state
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterType, setFilterType] = useState('color');
//   const searchTimer = useRef(null);

//   // Add/Edit modal state
//   const [formModalOpen, setFormModalOpen] = useState(false);
//   const [formMode, setFormMode] = useState('add');
//   const [formType, setFormType] = useState('color');
//   const [formDmsName, setFormDmsName] = useState('');
//   const [formMisName, setFormMisName] = useState('');
//   const [formRemarks, setFormRemarks] = useState('');
//   const [editingId, setEditingId] = useState(null);
//   const [formLoading, setFormLoading] = useState(false);
//   const [formError, setFormError] = useState('');

//   // Export modal state
//   const [exportModalOpen, setExportModalOpen] = useState(false);
//   const [exportType, setExportType] = useState('color');
//   const [exportLoading, setExportLoading] = useState(false);

//   // Import modal state
//   const [importModalOpen, setImportModalOpen] = useState(false);
//   const [importType, setImportType] = useState('color');
//   const [importFile, setImportFile] = useState(null);
//   const [importLoading, setImportLoading] = useState(false);
//   const [importResult, setImportResult] = useState(null);

//   const { permissions = [] } = useTableFilter ? { permissions: [] } : { permissions: [] };
//   const navigate = useNavigate();

//   const canView = true;
//   const canCreate = true;
//   const canUpdate = true;
//   const canDelete = true;

//   useEffect(() => {
//     fetchData();
//   }, [pagination.page, pagination.limit, filterType]);

//   useEffect(() => {
//     if (searchTimer.current) clearTimeout(searchTimer.current);
//     searchTimer.current = setTimeout(() => {
//       setPagination((prev) => ({ ...prev, page: 1 }));
//       fetchData(1, pagination.limit, searchTerm);
//     }, 500);
//     return () => {
//       if (searchTimer.current) clearTimeout(searchTimer.current);
//     };
//   }, [searchTerm]);

//   const fetchData = async (page = pagination.page, limit = pagination.limit, search = searchTerm) => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams();
//       params.append('page', page);
//       params.append('limit', limit);
//       if (search && search.trim()) params.append('search', search.trim());
//       if (filterType) params.append('type', filterType);

//       const response = await axiosInstance.get(`/advance-model-mapping?${params.toString()}`);
//       const body = response.data;

//       setMappings(body.data || []);
//       setPagination({
//         page: body.page || 1,
//         limit,
//         total: body.total || 0,
//         pages: body.pages || 1
//       });
//       setError(null);
//     } catch (err) {
//       const message = showError(err);
//       if (message) setError(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage < 1 || newPage > pagination.pages) return;
//     setPagination((prev) => ({ ...prev, page: newPage }));
//   };

//   const handleLimitChange = (newLimit) => {
//     setPagination((prev) => ({ ...prev, limit: parseInt(newLimit, 10), page: 1 }));
//   };

//   // ---------------------------------------------------------------------
//   // Add / Edit - FIXED to use the correct endpoint
//   // ---------------------------------------------------------------------
//   const openAddModal = () => {
//     if (!canCreate) {
//       showError('You do not have permission to add mappings');
//       return;
//     }
//     setFormMode('add');
//     setFormType(filterType || 'color');
//     setFormDmsName('');
//     setFormMisName('');
//     setFormRemarks('');
//     setEditingId(null);
//     setFormError('');
//     setFormModalOpen(true);
//   };

//   const openEditModal = (mapping) => {
//     if (!canUpdate) {
//       showError('You do not have permission to edit mappings');
//       return;
//     }
//     setFormMode('edit');
//     setFormType(mapping.type);
//     setFormDmsName(mapping.dms_name);
//     setFormMisName(mapping.mis_name || '');
//     setFormRemarks(mapping.remarks || '');
//     setEditingId(mapping._id);
//     setFormError('');
//     setFormModalOpen(true);
//   };

//   const resetFormModal = () => {
//     setFormModalOpen(false);
//     setFormError('');
//   };

//   const handleFormSubmit = async () => {
//     if (!formDmsName.trim()) {
//       setFormError('DMS name is required');
//       return;
//     }

//     setFormLoading(true);
//     setFormError('');
//     try {
//       if (formMode === 'add') {
//         // FIXED: Use the single create endpoint instead of bulk
//         await axiosInstance.post('/advance-model-mapping', {
//           type: formType,
//           dms_name: formDmsName.trim(),
//           mis_name: formMisName.trim() || undefined,
//           remarks: formRemarks.trim() || undefined
//         });
//         showSuccess('Mapping added successfully!');
//       } else {
//         await axiosInstance.put(`/advance-model-mapping/${editingId}`, {
//           type: formType,
//           dms_name: formDmsName.trim(),
//           mis_name: formMisName.trim() || null,
//           remarks: formRemarks.trim() || null
//         });
//         showSuccess('Mapping updated successfully!');
//       }
//       resetFormModal();
//       fetchData();
//     } catch (err) {
//       const message = err.response?.data?.message || 'Failed to save mapping';
//       setFormError(message);
//       showError(message);
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   // ---------------------------------------------------------------------
//   // Delete
//   // ---------------------------------------------------------------------
//   const handleDelete = async (id) => {
//     if (!canDelete) {
//       showError('You do not have permission to delete mappings');
//       return;
//     }
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/advance-model-mapping/${id}`);
//         showSuccess('Mapping deactivated successfully!');
//         fetchData();
//       } catch (err) {
//         showError(err.response?.data?.message || 'Failed to delete mapping');
//       }
//     }
//   };

//   // ---------------------------------------------------------------------
//   // Export
//   // ---------------------------------------------------------------------
//   const handleExport = async () => {
//     setExportLoading(true);
//     try {
//       const response = await axiosInstance.get(
//         `/advance-model-mapping/export?type=${exportType}`,
//         { responseType: 'blob' }
//       );

//       const blob = new Blob([response.data], {
//         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//       });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute(
//         'download',
//         `Advance_Model_Mapping_${exportType}_${new Date().toLocaleDateString()}.xlsx`
//       );
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);

//       setExportModalOpen(false);
//       showSuccess('Excel exported successfully!');
//     } catch (err) {
//       console.error('Export failed:', err);
//       showError('Failed to export Excel');
//     } finally {
//       setExportLoading(false);
//     }
//   };

//   // ---------------------------------------------------------------------
//   // Import
//   // ---------------------------------------------------------------------
//   const handleImportFileChange = (e) => {
//     setImportFile(e.target.files[0]);
//   };

//   const resetImportModal = () => {
//     setImportModalOpen(false);
//     setImportFile(null);
//     setImportResult(null);
//   };

//   const handleImport = async () => {
//     if (!importFile) {
//       showError('Please select a file');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', importFile);
//     formData.append('type', importType);

//     setImportLoading(true);
//     setImportResult(null);
//     try {
//       const response = await axiosInstance.post('/advance-model-mapping/import', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
//       setImportResult(response.data);
//       showSuccess(response.data.message || 'Import completed');
//       fetchData();
//     } catch (err) {
//       const message = err.response?.data?.message || 'Failed to import file';
//       showError(message);
//       setImportResult(err.response?.data || null);
//     } finally {
//       setImportLoading(false);
//     }
//   };

//   if (loading && mappings.length === 0) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" />
//       </div>
//     );
//   }

//   if (!canView) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Advance Model Mapping.
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="alert alert-danger" role="alert">
//         {error}
//       </div>
//     );
//   }

//   const startRecord = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
//   const endRecord = Math.min(pagination.page * pagination.limit, pagination.total);

//   let startPage = Math.max(1, pagination.page - 2);
//   let endPage = Math.min(pagination.pages, pagination.page + 2);
//   if (pagination.page <= 3) endPage = Math.min(5, pagination.pages);
//   if (pagination.page >= pagination.pages - 2) startPage = Math.max(1, pagination.pages - 4);
//   const displayedPages = [];
//   for (let i = startPage; i <= endPage; i++) displayedPages.push(i);

//   return (
//     <div>
//       <style>{`
//         .advance-mapping-tabs .nav-link {
//           color: #6b7280;
//           font-weight: 500;
//           border-bottom: 2px solid transparent;
//           padding: 8px 16px;
//         }
//         .advance-mapping-tabs .nav-link.active {
//           color: #2563eb;
//           font-weight: 600;
//           border-bottom: 2px solid #2563eb;
//           background: transparent;
//         }
//         .advance-mapping-tabs .nav-link:hover {
//           color: #2563eb;
//         }

//         .pill-action-btn {
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           border-radius: 6px;
//           padding: 5px 12px;
//           font-size: 13px;
//           font-weight: 500;
//           border: none;
//           line-height: 1.4;
//         }
//         .pill-action-btn svg,
//         .pill-action-btn .c-icon,
//         .pill-action-btn .icon {
//           width: 15px;
//           height: 15px;
//         }
//         .pill-action-btn-primary {
//           background-color: #2563eb;
//           color: #fff;
//         }
//         .pill-action-btn-primary:hover {
//           background-color: #1d4ed8;
//           color: #fff;
//         }
//         .pill-action-btn-outline {
//           background-color: #fff;
//           color: #374151;
//           border: 1px solid #d1d5db;
//         }
//         .pill-action-btn-outline:hover {
//           background-color: #f3f4f6;
//           color: #374151;
//         }

//         .options-dropdown-btn {
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           gap: 6px;
//           border-radius: 6px;
//           padding: 5px 12px;
//           font-size: 13px;
//           font-weight: 500;
//           background-color: #fff;
//           color: #374151;
//           border: 1px solid #d1d5db;
//         }
//         .options-dropdown-btn:hover,
//         .options-dropdown-btn:focus,
//         .options-dropdown-btn:active {
//           background-color: #f3f4f6 !important;
//           color: #374151 !important;
//           border-color: #d1d5db !important;
//         }
//         .options-dropdown-btn::after {
//           display: none;
//         }
//         .options-dropdown-menu .dropdown-item {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           font-size: 13px;
//           padding: 8px 14px;
//         }
//         .options-dropdown-menu .dropdown-item.text-danger:hover {
//           background-color: #fef2f2;
//         }
//       `}</style>
//       <div className="title">Advance Model Mapping</div>

//       <CCard className="table-container mt-4">
//         <CCardHeader className="card-header d-flex justify-content-between align-items-center">
//           <div>
//             {canCreate && (
//               <CButton size="sm" className="action-btn me-1" onClick={openAddModal}>
//                 <CIcon icon={cilPlus} className="icon" /> New Mapping
//               </CButton>
//             )}

//             <CButton
//               size="sm"
//               className="action-btn me-1"
//               onClick={() => setExportModalOpen(true)}
//             >
//               <CIcon icon={cilCloudDownload} className="icon" /> Export Excel
//             </CButton>

//             {canCreate && (
//               <CButton
//                 size="sm"
//                 className="action-btn me-1"
//                 onClick={() => setImportModalOpen(true)}
//               >
//                 <CIcon icon={cilCloudUpload} className="icon" /> Import Excel
//               </CButton>
//             )}
//           </div>
//         </CCardHeader>

//         <CCardBody>
//           <CNav variant="underline" className="mb-3 advance-mapping-tabs">
//             <CNavItem>
//               <CNavLink
//                 active={filterType === 'color'}
//                 onClick={() => {
//                   setFilterType('color');
//                   setPagination((prev) => ({ ...prev, page: 1 }));
//                 }}
//                 style={{ cursor: 'pointer' }}
//               >
//                 Colour
//               </CNavLink>
//             </CNavItem>
//             <CNavItem>
//               <CNavLink
//                 active={filterType === 'model'}
//                 onClick={() => {
//                   setFilterType('model');
//                   setPagination((prev) => ({ ...prev, page: 1 }));
//                 }}
//                 style={{ cursor: 'pointer' }}
//               >
//                 Model
//               </CNavLink>
//             </CNavItem>
//           </CNav>

//           <div className="d-flex justify-content-between mb-3 align-items-center flex-wrap gap-2">
//             <div className="d-flex align-items-center">
//               <CFormLabel className="mb-0 me-2">Rows per page:</CFormLabel>
//               <CFormSelect
//                 value={pagination.limit}
//                 onChange={(e) => handleLimitChange(e.target.value)}
//                 style={{ width: '80px' }}
//                 size="sm"
//               >
//                 {PAGE_SIZE_OPTIONS.map((option) => (
//                   <option key={option} value={option}>
//                     {option}
//                   </option>
//                 ))}
//               </CFormSelect>
//             </div>

//             <div className="d-flex align-items-center">
//               <CFormLabel className="mt-1 m-1">Search:</CFormLabel>
//               <CFormInput
//                 type="text"
//                 className="d-inline-block square-search"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search by DMS or MIS name..."
//                 style={{ width: '250px' }}
//               />
//             </div>
//           </div>

//           {loading && (
//             <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
//               <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
//             </div>
//           )}

//           <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
//             <CTable striped bordered hover className="responsive-table">
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Type</CTableHeaderCell>
//                   <CTableHeaderCell>DMS Name</CTableHeaderCell>
//                   <CTableHeaderCell>MIS Name</CTableHeaderCell>
//                   <CTableHeaderCell>Remarks</CTableHeaderCell>
//                   <CTableHeaderCell>Status</CTableHeaderCell>
//                   {(canUpdate || canDelete) && <CTableHeaderCell>Action</CTableHeaderCell>}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {mappings.length === 0 && !loading ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan={(canUpdate || canDelete) ? '7' : '6'} className="text-center">
//                       {searchTerm ? `No results found for "${searchTerm}"` : 'No mappings available'}
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   mappings.map((mapping, index) => {
//                     const globalIndex = (pagination.page - 1) * pagination.limit + index + 1;
//                     return (
//                       <CTableRow key={mapping._id}>
//                         <CTableDataCell>{globalIndex}</CTableDataCell>
//                         <CTableDataCell>
//                           <CBadge color={mapping.type === 'color' ? 'info' : 'primary'}>
//                             {mapping.type === 'color' ? 'Colour' : 'Model'}
//                           </CBadge>
//                         </CTableDataCell>
//                         <CTableDataCell>{mapping.dms_name}</CTableDataCell>
//                         <CTableDataCell>{mapping.mis_name || '—'}</CTableDataCell>
//                         <CTableDataCell>{mapping.remarks || '—'}</CTableDataCell>
//                         <CTableDataCell>
//                           <CBadge color={mapping.status === 'active' ? 'success' : 'secondary'}>
//                             {mapping.status}
//                           </CBadge>
//                         </CTableDataCell>
//                         {(canUpdate || canDelete) && (
//                           <CTableDataCell>
//                             <CDropdown alignment="end">
//                               <CDropdownToggle
//                                 size="sm"
//                                 className="options-dropdown-btn"
//                                 caret={false}
//                               >
//                                 <CIcon icon={cilSettings} />
//                                 Options
//                               </CDropdownToggle>
//                               <CDropdownMenu className="options-dropdown-menu">
//                                 {canUpdate && (
//                                   <CDropdownItem
//                                     style={{ cursor: 'pointer' }}
//                                     onClick={() => openEditModal(mapping)}
//                                   >
//                                     <CIcon icon={cilPencil} />
//                                     Edit
//                                   </CDropdownItem>
//                                 )}
//                                 {canDelete && (
//                                   <CDropdownItem
//                                     className="text-danger"
//                                     style={{ cursor: 'pointer' }}
//                                     onClick={() => handleDelete(mapping._id)}
//                                   >
//                                     <CIcon icon={cilTrash} />
//                                     Delete
//                                   </CDropdownItem>
//                                 )}
//                               </CDropdownMenu>
//                             </CDropdown>
//                           </CTableDataCell>
//                         )}
//                       </CTableRow>
//                     );
//                   })
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>

//           {pagination.total > 0 && (
//             <div className="mt-4">
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <span className="text-muted" style={{ fontSize: '13px' }}>
//                   {loading ? 'Loading…' : `Showing ${startRecord}–${endRecord} of ${pagination.total} records`}
//                 </span>
//               </div>

//               {pagination.pages > 1 && (
//                 <CPagination align="center" aria-label="Page navigation">
//                   <CPaginationItem
//                     aria-label="Previous"
//                     onClick={() => handlePageChange(pagination.page - 1)}
//                     disabled={pagination.page === 1 || loading}
//                   >
//                     <CIcon icon={cilChevronLeft} />
//                   </CPaginationItem>

//                   {displayedPages.map((page) => (
//                     <CPaginationItem
//                       key={page}
//                       onClick={() => handlePageChange(page)}
//                       active={pagination.page === page}
//                       disabled={loading}
//                     >
//                       {page}
//                     </CPaginationItem>
//                   ))}

//                   <CPaginationItem
//                     aria-label="Next"
//                     onClick={() => handlePageChange(pagination.page + 1)}
//                     disabled={pagination.page === pagination.pages || loading}
//                   >
//                     <CIcon icon={cilChevronRight} />
//                   </CPaginationItem>
//                 </CPagination>
//               )}
//             </div>
//           )}
//         </CCardBody>
//       </CCard>

//       {/* Add / Edit Modal */}
//       <CModal visible={formModalOpen} onClose={resetFormModal}>
//         <CModalHeader>
//           <CModalTitle>{formMode === 'add' ? 'Add Mapping' : 'Edit Mapping'}</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {formError && <CAlert color="danger">{formError}</CAlert>}

//           <div className="mb-3">
//             <CFormLabel>Type<span className="required">*</span></CFormLabel>
//             <CFormSelect
//               value={formType}
//               onChange={(e) => setFormType(e.target.value)}
//               disabled={formMode === 'edit'}
//             >
//               <option value="color">Colour</option>
//               <option value="model">Model</option>
//             </CFormSelect>
//           </div>

//           <div className="mb-3">
//             <CFormLabel>
//               {formType === 'color' ? 'DMS Vehicle Colour' : 'DMS Vehicle Model'}
//               <span className="required">*</span>
//             </CFormLabel>
//             <CFormInput
//               value={formDmsName}
//               onChange={(e) => setFormDmsName(e.target.value)}
//               placeholder={formType === 'color' ? 'e.g. Pearl White' : 'e.g. Activa 6G'}
//             />
//           </div>

//           <div className="mb-3">
//             <CFormLabel>
//               {formType === 'color' ? 'MIS Vehicle Colour' : 'MIS Vehicle Model'}
//             </CFormLabel>
//             <CFormInput
//               value={formMisName}
//               onChange={(e) => setFormMisName(e.target.value)}
//               placeholder={formType === 'color' ? 'e.g. WHITE PEARL' : 'e.g. ACTIVA-6G'}
//             />
//           </div>

//           <div className="mb-3">
//             <CFormLabel>Remarks</CFormLabel>
//             <CFormTextarea
//               value={formRemarks}
//               onChange={(e) => setFormRemarks(e.target.value)}
//               rows={2}
//             />
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={resetFormModal} disabled={formLoading}>
//             Cancel
//           </CButton>
//           <CButton className="submit-button" onClick={handleFormSubmit} disabled={formLoading}>
//             {formLoading ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 Saving...
//               </>
//             ) : (
//               'Save'
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Export Modal */}
//       <CModal visible={exportModalOpen} onClose={() => setExportModalOpen(false)}>
//         <CModalHeader>
//           <CModalTitle>Export Excel</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <CFormLabel>Type:</CFormLabel>
//             <CFormSelect value={exportType} onChange={(e) => setExportType(e.target.value)}>
//               <option value="color">Colour</option>
//               <option value="model">Model</option>
//             </CFormSelect>
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton className="submit-button" onClick={handleExport} disabled={exportLoading}>
//             {exportLoading ? 'Exporting...' : 'Export'}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Import Modal */}
//       <CModal visible={importModalOpen} onClose={resetImportModal}>
//         <CModalHeader>
//           <CModalTitle>Import Excel</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <CFormLabel>Type:</CFormLabel>
//             <CFormSelect value={importType} onChange={(e) => setImportType(e.target.value)}>
//               <option value="color">Colour</option>
//               <option value="model">Model</option>
//             </CFormSelect>
//           </div>

//           <div className="mb-3">
//             <CFormLabel>Select Excel/CSV File:</CFormLabel>
//             <CFormInput
//               type="file"
//               id="advance-mapping-import-file"
//               accept=".xlsx,.xls,.csv"
//               onChange={handleImportFileChange}
//             />
//             <small className="text-muted">Supported formats: .xlsx, .xls, .csv</small>
//           </div>

//           {importFile && (
//             <CAlert color="info">
//               Selected file: {importFile.name} ({(importFile.size / 1024).toFixed(2)} KB)
//             </CAlert>
//           )}

//           {importResult && (
//             <CAlert color={importResult.status === 'success' ? 'success' : 'warning'}>
//               <div className="d-flex align-items-center mb-2">
//                 <CIcon
//                   icon={importResult.status === 'success' ? cilCheckCircle : cilWarning}
//                   className="me-2"
//                 />
//                 {importResult.message}
//               </div>
//               {importResult.summary && (
//                 <ul className="mb-0">
//                   <li>Total rows: {importResult.summary.totalRows}</li>
//                   <li>Created: {importResult.summary.created}</li>
//                   <li>Updated: {importResult.summary.updated}</li>
//                   <li>Skipped: {importResult.summary.skipped}</li>
//                 </ul>
//               )}
//             </CAlert>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={resetImportModal} disabled={importLoading}>
//             Close
//           </CButton>
//           <CButton
//             className="submit-button"
//             onClick={handleImport}
//             disabled={!importFile || importLoading}
//           >
//             {importLoading ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 Importing...
//               </>
//             ) : (
//               'Import'
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </div>
//   );
// };

// export default AdvantageModelMapping;

//----------------5 sep----------------


// import '../../css/table.css';
// import '../../css/form.css';
// import {
//   React,
//   useState,
//   useEffect,
//   getDefaultSearchFields,
//   useTableFilter,
//   confirmDelete,
//   showError,
//   showSuccess,
//   axiosInstance
// } from '../../utils/tableImports';
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
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CFormSelect,
//   CFormTextarea,
//   CAlert,
//   CPagination,
//   CPaginationItem,
//   CNav,
//   CNavItem,
//   CNavLink,
//   CDropdown,
//   CDropdownToggle,
//   CDropdownMenu,
//   CDropdownItem
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import {
//   cilPlus,
//   cilSearch,
//   cilSettings,
//   cilPencil,
//   cilTrash,
//   cilCloudDownload,
//   cilCloudUpload,
//   cilCheckCircle,
//   cilWarning,
//   cilChevronLeft,
//   cilChevronRight
// } from '@coreui/icons';
// import { useNavigate } from 'react-router-dom';
// import { useRef } from 'react';

// const PAGE_SIZE_OPTIONS = [25, 50, 100];
// const DEFAULT_LIMIT = 25;

// const AdvantageModelMapping = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Server-side state
//   const [mappings, setMappings] = useState([]);
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: DEFAULT_LIMIT,
//     total: 0,
//     pages: 1
//   });

//   // Search / filter state
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterType, setFilterType] = useState('color');
//   const searchTimer = useRef(null);

//   // Add/Edit modal state
//   const [formModalOpen, setFormModalOpen] = useState(false);
//   const [formMode, setFormMode] = useState('add');
//   const [formType, setFormType] = useState('color');
//   const [formDmsName, setFormDmsName] = useState('');
//   const [formMisName, setFormMisName] = useState('');
//   const [formRemarks, setFormRemarks] = useState('');
//   const [editingId, setEditingId] = useState(null);
//   const [formLoading, setFormLoading] = useState(false);
//   const [formError, setFormError] = useState('');

//   // ---- Full model list, fetched once and filtered client-side ----
//   // (the /models API doesn't actually filter server-side on `search`, it
//   // returns the full list every time, so we cache it and filter locally)
//   const [allModels, setAllModels] = useState([]);
//   const [modelsLoaded, setModelsLoaded] = useState(false);
//   const [modelsLoading, setModelsLoading] = useState(false);
//   const modelsLoadPromise = useRef(null);

//   // ---- Model typeahead (used for Type = "model" DMS field) ----
//   const [modelSuggestions, setModelSuggestions] = useState([]);
//   const [showModelSuggestions, setShowModelSuggestions] = useState(false);
//   const modelSearchTimer = useRef(null);

//   // ---- Model picker used to scope colours (used for Type = "color") ----
//   const [colorModelQuery, setColorModelQuery] = useState('');
//   const [colorModelSuggestions, setColorModelSuggestions] = useState([]);
//   const [showColorModelSuggestions, setShowColorModelSuggestions] = useState(false);
//   const colorModelSearchTimer = useRef(null);
//   const [selectedColorModelId, setSelectedColorModelId] = useState(null);

//   const [colorOptions, setColorOptions] = useState([]);
//   const [colorsLoading, setColorsLoading] = useState(false);

//   // Export modal state
//   const [exportModalOpen, setExportModalOpen] = useState(false);
//   const [exportType, setExportType] = useState('color');
//   const [exportLoading, setExportLoading] = useState(false);

//   // Import modal state
//   const [importModalOpen, setImportModalOpen] = useState(false);
//   const [importType, setImportType] = useState('color');
//   const [importFile, setImportFile] = useState(null);
//   const [importLoading, setImportLoading] = useState(false);
//   const [importResult, setImportResult] = useState(null);

//   const { permissions = [] } = useTableFilter ? { permissions: [] } : { permissions: [] };
//   const navigate = useNavigate();

//   const canView = true;
//   const canCreate = true;
//   const canUpdate = true;
//   const canDelete = true;

//   useEffect(() => {
//     fetchData();
//   }, [pagination.page, pagination.limit, filterType]);

//   useEffect(() => {
//     if (searchTimer.current) clearTimeout(searchTimer.current);
//     searchTimer.current = setTimeout(() => {
//       setPagination((prev) => ({ ...prev, page: 1 }));
//       fetchData(1, pagination.limit, searchTerm);
//     }, 500);
//     return () => {
//       if (searchTimer.current) clearTimeout(searchTimer.current);
//     };
//   }, [searchTerm]);

//   const fetchData = async (page = pagination.page, limit = pagination.limit, search = searchTerm) => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams();
//       params.append('page', page);
//       params.append('limit', limit);
//       if (search && search.trim()) params.append('search', search.trim());
//       if (filterType) params.append('type', filterType);

//       const response = await axiosInstance.get(`/advance-model-mapping?${params.toString()}`);
//       const body = response.data;

//       setMappings(body.data || []);
//       setPagination({
//         page: body.page || 1,
//         limit,
//         total: body.total || 0,
//         pages: body.pages || 1
//       });
//       setError(null);
//     } catch (err) {
//       const message = showError(err);
//       if (message) setError(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage < 1 || newPage > pagination.pages) return;
//     setPagination((prev) => ({ ...prev, page: newPage }));
//   };

//   const handleLimitChange = (newLimit) => {
//     setPagination((prev) => ({ ...prev, limit: parseInt(newLimit, 10), page: 1 }));
//   };

//   // ---------------------------------------------------------------------
//   // Model / Colour lookups (typeahead + colour-by-model)
//   // ---------------------------------------------------------------------
//   const extractList = (body, key) => {
//     if (!body) return [];
//     // API can return: a bare array, { data: [...] }, { data: { models: [...] } },
//     // or { models: [...] } — handle all of these.
//     if (Array.isArray(body)) return body;
//     if (Array.isArray(body?.data?.[key])) return body.data[key];
//     if (Array.isArray(body?.[key])) return body[key];
//     if (Array.isArray(body?.data)) return body.data;
//     return [];
//   };

//   // Fetches the full model list once and caches it (the API doesn't filter
//   // server-side, so we filter locally instead). Returns the cached/fetched list.
//   const loadAllModels = async () => {
//     if (modelsLoaded) return allModels;
//     if (modelsLoadPromise.current) return modelsLoadPromise.current;

//     setModelsLoading(true);
//     const promise = axiosInstance
//       .get('/models')
//       .then((response) => {
//         const list = extractList(response.data, 'models');
//         setAllModels(list);
//         setModelsLoaded(true);
//         return list;
//       })
//       .catch(() => {
//         setAllModels([]);
//         return [];
//       })
//       .finally(() => {
//         setModelsLoading(false);
//         modelsLoadPromise.current = null;
//       });

//     modelsLoadPromise.current = promise;
//     return promise;
//   };

//   const filterModels = (list, query) => {
//     const q = (query || '').trim().toLowerCase();
//     if (!q) return list.slice(0, 20);
//     return list.filter((m) => (m.model_name || m.name || '').toLowerCase().includes(q)).slice(0, 20);
//   };

//   const searchModels = async (query, setSuggestions) => {
//     const list = await loadAllModels();
//     setSuggestions(filterModels(list, query));
//   };

//   const fetchColorsForModel = async (modelId) => {
//     if (!modelId) {
//       setColorOptions([]);
//       return;
//     }
//     try {
//       setColorsLoading(true);
//       const response = await axiosInstance.get(`/colors/model/${modelId}`);
//       const list = extractList(response.data, 'colors');
//       setColorOptions(Array.isArray(list) ? list : []);
//     } catch (err) {
//       setColorOptions([]);
//     } finally {
//       setColorsLoading(false);
//     }
//   };

//   // DMS Vehicle Model field (Type = "model") — typeahead as the user types
//   const handleDmsModelInputChange = (value) => {
//     setFormDmsName(value);
//     setShowModelSuggestions(true);
//     if (modelSearchTimer.current) clearTimeout(modelSearchTimer.current);
//     modelSearchTimer.current = setTimeout(() => {
//       searchModels(value, setModelSuggestions);
//     }, 200);
//   };

//   const handleSelectModelSuggestion = (model) => {
//     setFormDmsName(model.model_name || model.name);
//     setShowModelSuggestions(false);
//     setModelSuggestions([]);
//   };

//   // Model picker used to scope the colour dropdown (Type = "color")
//   const handleColorModelQueryChange = (value) => {
//     setColorModelQuery(value);
//     setSelectedColorModelId(null);
//     setColorOptions([]);
//     setFormDmsName('');
//     setShowColorModelSuggestions(true);
//     if (colorModelSearchTimer.current) clearTimeout(colorModelSearchTimer.current);
//     colorModelSearchTimer.current = setTimeout(() => {
//       searchModels(value, setColorModelSuggestions);
//     }, 200);
//   };

//   const handleSelectColorModel = (model) => {
//     const modelId = model.id || model._id;
//     setColorModelQuery(model.model_name || model.name);
//     setSelectedColorModelId(modelId);
//     setShowColorModelSuggestions(false);
//     setColorModelSuggestions([]);
//     setFormDmsName('');
//     fetchColorsForModel(modelId);
//   };

//   const resetLookupState = () => {
//     setModelSuggestions([]);
//     setShowModelSuggestions(false);
//     setColorModelQuery('');
//     setColorModelSuggestions([]);
//     setShowColorModelSuggestions(false);
//     setSelectedColorModelId(null);
//     setColorOptions([]);
//     setColorsLoading(false);
//   };

//   // ---------------------------------------------------------------------
//   // Add / Edit - FIXED to use the correct endpoint
//   // ---------------------------------------------------------------------
//   const openAddModal = () => {
//     if (!canCreate) {
//       showError('You do not have permission to add mappings');
//       return;
//     }
//     setFormMode('add');
//     setFormType(filterType || 'color');
//     setFormDmsName('');
//     setFormMisName('');
//     setFormRemarks('');
//     setEditingId(null);
//     setFormError('');
//     resetLookupState();
//     setFormModalOpen(true);
//   };

//   const openEditModal = (mapping) => {
//     if (!canUpdate) {
//       showError('You do not have permission to edit mappings');
//       return;
//     }
//     setFormMode('edit');
//     setFormType(mapping.type);
//     setFormDmsName(mapping.dms_name);
//     setFormMisName(mapping.mis_name || '');
//     setFormRemarks(mapping.remarks || '');
//     setEditingId(mapping._id);
//     setFormError('');
//     resetLookupState();
//     setFormModalOpen(true);
//   };

//   const resetFormModal = () => {
//     setFormModalOpen(false);
//     setFormError('');
//   };

//   const handleFormTypeChange = (newType) => {
//     setFormType(newType);
//     setFormDmsName('');
//     resetLookupState();
//   };

//   const handleFormSubmit = async () => {
//     if (!formDmsName.trim()) {
//       setFormError(formType === 'color' ? 'DMS colour is required' : 'DMS name is required');
//       return;
//     }

//     setFormLoading(true);
//     setFormError('');
//     try {
//       if (formMode === 'add') {
//         // FIXED: Use the single create endpoint instead of bulk
//         await axiosInstance.post('/advance-model-mapping', {
//           type: formType,
//           dms_name: formDmsName.trim(),
//           mis_name: formMisName.trim() || undefined,
//           remarks: formRemarks.trim() || undefined
//         });
//         showSuccess('Mapping added successfully!');
//       } else {
//         await axiosInstance.put(`/advance-model-mapping/${editingId}`, {
//           type: formType,
//           dms_name: formDmsName.trim(),
//           mis_name: formMisName.trim() || null,
//           remarks: formRemarks.trim() || null
//         });
//         showSuccess('Mapping updated successfully!');
//       }
//       resetFormModal();
//       fetchData();
//     } catch (err) {
//       const message = err.response?.data?.message || 'Failed to save mapping';
//       setFormError(message);
//       showError(message);
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   // ---------------------------------------------------------------------
//   // Delete
//   // ---------------------------------------------------------------------
//   const handleDelete = async (id) => {
//     if (!canDelete) {
//       showError('You do not have permission to delete mappings');
//       return;
//     }
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/advance-model-mapping/${id}`);
//         showSuccess('Mapping deactivated successfully!');
//         fetchData();
//       } catch (err) {
//         showError(err.response?.data?.message || 'Failed to delete mapping');
//       }
//     }
//   };

//   // ---------------------------------------------------------------------
//   // Export
//   // ---------------------------------------------------------------------
//   const handleExport = async () => {
//     setExportLoading(true);
//     try {
//       const response = await axiosInstance.get(
//         `/advance-model-mapping/export?type=${exportType}`,
//         { responseType: 'blob' }
//       );

//       const blob = new Blob([response.data], {
//         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//       });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute(
//         'download',
//         `Advance_Model_Mapping_${exportType}_${new Date().toLocaleDateString()}.xlsx`
//       );
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);

//       setExportModalOpen(false);
//       showSuccess('Excel exported successfully!');
//     } catch (err) {
//       console.error('Export failed:', err);
//       showError('Failed to export Excel');
//     } finally {
//       setExportLoading(false);
//     }
//   };

//   // ---------------------------------------------------------------------
//   // Import
//   // ---------------------------------------------------------------------
//   const handleImportFileChange = (e) => {
//     setImportFile(e.target.files[0]);
//   };

//   const resetImportModal = () => {
//     setImportModalOpen(false);
//     setImportFile(null);
//     setImportResult(null);
//   };

//   const handleImport = async () => {
//     if (!importFile) {
//       showError('Please select a file');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', importFile);
//     formData.append('type', importType);

//     setImportLoading(true);
//     setImportResult(null);
//     try {
//       const response = await axiosInstance.post('/advance-model-mapping/import', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
//       setImportResult(response.data);
//       showSuccess(response.data.message || 'Import completed');
//       fetchData();
//     } catch (err) {
//       const message = err.response?.data?.message || 'Failed to import file';
//       showError(message);
//       setImportResult(err.response?.data || null);
//     } finally {
//       setImportLoading(false);
//     }
//   };

//   if (loading && mappings.length === 0) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" />
//       </div>
//     );
//   }

//   if (!canView) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Advance Model Mapping.
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="alert alert-danger" role="alert">
//         {error}
//       </div>
//     );
//   }

//   const startRecord = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
//   const endRecord = Math.min(pagination.page * pagination.limit, pagination.total);

//   let startPage = Math.max(1, pagination.page - 2);
//   let endPage = Math.min(pagination.pages, pagination.page + 2);
//   if (pagination.page <= 3) endPage = Math.min(5, pagination.pages);
//   if (pagination.page >= pagination.pages - 2) startPage = Math.max(1, pagination.pages - 4);
//   const displayedPages = [];
//   for (let i = startPage; i <= endPage; i++) displayedPages.push(i);

//   return (
//     <div>
//       <style>{`
//         .advance-mapping-tabs .nav-link {
//           color: #6b7280;
//           font-weight: 500;
//           border-bottom: 2px solid transparent;
//           padding: 8px 16px;
//         }
//         .advance-mapping-tabs .nav-link.active {
//           color: #2563eb;
//           font-weight: 600;
//           border-bottom: 2px solid #2563eb;
//           background: transparent;
//         }
//         .advance-mapping-tabs .nav-link:hover {
//           color: #2563eb;
//         }

//         .pill-action-btn {
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           border-radius: 6px;
//           padding: 5px 12px;
//           font-size: 13px;
//           font-weight: 500;
//           border: none;
//           line-height: 1.4;
//         }
//         .pill-action-btn svg,
//         .pill-action-btn .c-icon,
//         .pill-action-btn .icon {
//           width: 15px;
//           height: 15px;
//         }
//         .pill-action-btn-primary {
//           background-color: #2563eb;
//           color: #fff;
//         }
//         .pill-action-btn-primary:hover {
//           background-color: #1d4ed8;
//           color: #fff;
//         }
//         .pill-action-btn-outline {
//           background-color: #fff;
//           color: #374151;
//           border: 1px solid #d1d5db;
//         }
//         .pill-action-btn-outline:hover {
//           background-color: #f3f4f6;
//           color: #374151;
//         }

//         .options-dropdown-btn {
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           gap: 6px;
//           border-radius: 6px;
//           padding: 5px 12px;
//           font-size: 13px;
//           font-weight: 500;
//           background-color: #fff;
//           color: #374151;
//           border: 1px solid #d1d5db;
//         }
//         .options-dropdown-btn:hover,
//         .options-dropdown-btn:focus,
//         .options-dropdown-btn:active {
//           background-color: #f3f4f6 !important;
//           color: #374151 !important;
//           border-color: #d1d5db !important;
//         }
//         .options-dropdown-btn::after {
//           display: none;
//         }
//         .options-dropdown-menu .dropdown-item {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           font-size: 13px;
//           padding: 8px 14px;
//         }
//         .options-dropdown-menu .dropdown-item.text-danger:hover {
//           background-color: #fef2f2;
//         }

//         .autocomplete-field-wrap {
//           position: relative;
//         }
//         .autocomplete-suggestions {
//           position: absolute;
//           top: 100%;
//           left: 0;
//           right: 0;
//           z-index: 1060;
//           background: #fff;
//           border: 1px solid #d1d5db;
//           border-top: none;
//           border-radius: 0 0 6px 6px;
//           max-height: 220px;
//           overflow-y: auto;
//           box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
//         }
//         .autocomplete-suggestion-item {
//           padding: 8px 12px;
//           font-size: 14px;
//           cursor: pointer;
//         }
//         .autocomplete-suggestion-item:hover {
//           background-color: #f3f4f6;
//         }
//         .autocomplete-suggestion-item.disabled {
//           cursor: default;
//           color: #9ca3af;
//         }
//         .autocomplete-suggestion-item.disabled:hover {
//           background-color: transparent;
//         }
//       `}</style>
//       <div className="title">Advance Model Mapping</div>

//       <CCard className="table-container mt-4">
//         <CCardHeader className="card-header d-flex justify-content-between align-items-center">
//           <div>
//             {canCreate && (
//               <CButton size="sm" className="action-btn me-1" onClick={openAddModal}>
//                 <CIcon icon={cilPlus} className="icon" /> New Mapping
//               </CButton>
//             )}

//             <CButton
//               size="sm"
//               className="action-btn me-1"
//               onClick={() => setExportModalOpen(true)}
//             >
//               <CIcon icon={cilCloudDownload} className="icon" /> Export Excel
//             </CButton>

//             {canCreate && (
//               <CButton
//                 size="sm"
//                 className="action-btn me-1"
//                 onClick={() => setImportModalOpen(true)}
//               >
//                 <CIcon icon={cilCloudUpload} className="icon" /> Import Excel
//               </CButton>
//             )}
//           </div>
//         </CCardHeader>

//         <CCardBody>
//           <CNav variant="underline" className="mb-3 advance-mapping-tabs">
//             <CNavItem>
//               <CNavLink
//                 active={filterType === 'color'}
//                 onClick={() => {
//                   setFilterType('color');
//                   setPagination((prev) => ({ ...prev, page: 1 }));
//                 }}
//                 style={{ cursor: 'pointer' }}
//               >
//                 Colour
//               </CNavLink>
//             </CNavItem>
//             <CNavItem>
//               <CNavLink
//                 active={filterType === 'model'}
//                 onClick={() => {
//                   setFilterType('model');
//                   setPagination((prev) => ({ ...prev, page: 1 }));
//                 }}
//                 style={{ cursor: 'pointer' }}
//               >
//                 Model
//               </CNavLink>
//             </CNavItem>
//           </CNav>

//           <div className="d-flex justify-content-between mb-3 align-items-center flex-wrap gap-2">
//             <div className="d-flex align-items-center">
//               <CFormLabel className="mb-0 me-2">Rows per page:</CFormLabel>
//               <CFormSelect
//                 value={pagination.limit}
//                 onChange={(e) => handleLimitChange(e.target.value)}
//                 style={{ width: '80px' }}
//                 size="sm"
//               >
//                 {PAGE_SIZE_OPTIONS.map((option) => (
//                   <option key={option} value={option}>
//                     {option}
//                   </option>
//                 ))}
//               </CFormSelect>
//             </div>

//             <div className="d-flex align-items-center">
//               <CFormLabel className="mt-1 m-1">Search:</CFormLabel>
//               <CFormInput
//                 type="text"
//                 className="d-inline-block square-search"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search by DMS or MIS name..."
//                 style={{ width: '250px' }}
//               />
//             </div>
//           </div>

//           {loading && (
//             <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
//               <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
//             </div>
//           )}

//           <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
//             <CTable striped bordered hover className="responsive-table">
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Type</CTableHeaderCell>
//                   <CTableHeaderCell>DMS Name</CTableHeaderCell>
//                   <CTableHeaderCell>MIS Name</CTableHeaderCell>
//                   <CTableHeaderCell>Remarks</CTableHeaderCell>
//                   <CTableHeaderCell>Status</CTableHeaderCell>
//                   {(canUpdate || canDelete) && <CTableHeaderCell>Action</CTableHeaderCell>}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {mappings.length === 0 && !loading ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan={(canUpdate || canDelete) ? '7' : '6'} className="text-center">
//                       {searchTerm ? `No results found for "${searchTerm}"` : 'No mappings available'}
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   mappings.map((mapping, index) => {
//                     const globalIndex = (pagination.page - 1) * pagination.limit + index + 1;
//                     return (
//                       <CTableRow key={mapping._id}>
//                         <CTableDataCell>{globalIndex}</CTableDataCell>
//                         <CTableDataCell>
//                           <CBadge color={mapping.type === 'color' ? 'info' : 'primary'}>
//                             {mapping.type === 'color' ? 'Colour' : 'Model'}
//                           </CBadge>
//                         </CTableDataCell>
//                         <CTableDataCell>{mapping.dms_name}</CTableDataCell>
//                         <CTableDataCell>{mapping.mis_name || '—'}</CTableDataCell>
//                         <CTableDataCell>{mapping.remarks || '—'}</CTableDataCell>
//                         <CTableDataCell>
//                           <CBadge color={mapping.status === 'active' ? 'success' : 'secondary'}>
//                             {mapping.status}
//                           </CBadge>
//                         </CTableDataCell>
//                         {(canUpdate || canDelete) && (
//                           <CTableDataCell>
//                             <CDropdown alignment="end">
//                               <CDropdownToggle
//                                 size="sm"
//                                 className="options-dropdown-btn"
//                                 caret={false}
//                               >
//                                 <CIcon icon={cilSettings} />
//                                 Options
//                               </CDropdownToggle>
//                               <CDropdownMenu className="options-dropdown-menu">
//                                 {canUpdate && (
//                                   <CDropdownItem
//                                     style={{ cursor: 'pointer' }}
//                                     onClick={() => openEditModal(mapping)}
//                                   >
//                                     <CIcon icon={cilPencil} />
//                                     Edit
//                                   </CDropdownItem>
//                                 )}
//                                 {canDelete && (
//                                   <CDropdownItem
//                                     className="text-danger"
//                                     style={{ cursor: 'pointer' }}
//                                     onClick={() => handleDelete(mapping._id)}
//                                   >
//                                     <CIcon icon={cilTrash} />
//                                     Delete
//                                   </CDropdownItem>
//                                 )}
//                               </CDropdownMenu>
//                             </CDropdown>
//                           </CTableDataCell>
//                         )}
//                       </CTableRow>
//                     );
//                   })
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>

//           {pagination.total > 0 && (
//             <div className="mt-4">
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <span className="text-muted" style={{ fontSize: '13px' }}>
//                   {loading ? 'Loading…' : `Showing ${startRecord}–${endRecord} of ${pagination.total} records`}
//                 </span>
//               </div>

//               {pagination.pages > 1 && (
//                 <CPagination align="center" aria-label="Page navigation">
//                   <CPaginationItem
//                     aria-label="Previous"
//                     onClick={() => handlePageChange(pagination.page - 1)}
//                     disabled={pagination.page === 1 || loading}
//                   >
//                     <CIcon icon={cilChevronLeft} />
//                   </CPaginationItem>

//                   {displayedPages.map((page) => (
//                     <CPaginationItem
//                       key={page}
//                       onClick={() => handlePageChange(page)}
//                       active={pagination.page === page}
//                       disabled={loading}
//                     >
//                       {page}
//                     </CPaginationItem>
//                   ))}

//                   <CPaginationItem
//                     aria-label="Next"
//                     onClick={() => handlePageChange(pagination.page + 1)}
//                     disabled={pagination.page === pagination.pages || loading}
//                   >
//                     <CIcon icon={cilChevronRight} />
//                   </CPaginationItem>
//                 </CPagination>
//               )}
//             </div>
//           )}
//         </CCardBody>
//       </CCard>

//       {/* Add / Edit Modal */}
//       <CModal visible={formModalOpen} onClose={resetFormModal}>
//         <CModalHeader>
//           <CModalTitle>{formMode === 'add' ? 'Add Mapping' : 'Edit Mapping'}</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {formError && <CAlert color="danger">{formError}</CAlert>}

//           <div className="mb-3">
//             <CFormLabel>Type<span className="required">*</span></CFormLabel>
//             <CFormSelect
//               value={formType}
//               onChange={(e) => handleFormTypeChange(e.target.value)}
//               disabled={formMode === 'edit'}
//             >
//               <option value="color">Colour</option>
//               <option value="model">Model</option>
//             </CFormSelect>
//           </div>

//           {formType === 'model' ? (
//             // ------------------------------------------------------------
//             // Type = Model -> DMS field is a typeahead against /models
//             // ------------------------------------------------------------
//             <div className="mb-3 autocomplete-field-wrap">
//               <CFormLabel>
//                 DMS Vehicle Model<span className="required">*</span>
//               </CFormLabel>
//               <CFormInput
//                 value={formDmsName}
//                 onChange={(e) => handleDmsModelInputChange(e.target.value)}
//                 onFocus={() => {
//                   setShowModelSuggestions(true);
//                   searchModels(formDmsName, setModelSuggestions);
//                 }}
//                 onBlur={() => setTimeout(() => setShowModelSuggestions(false), 150)}
//                 placeholder="e.g. Activa 6G"
//                 autoComplete="off"
//               />
//               {showModelSuggestions && (
//                 <div className="autocomplete-suggestions">
//                   {modelsLoading ? (
//                     <div className="autocomplete-suggestion-item disabled">Loading models…</div>
//                   ) : modelSuggestions.length > 0 ? (
//                     modelSuggestions.map((model) => (
//                       <div
//                         key={model.id || model._id}
//                         className="autocomplete-suggestion-item"
//                         onMouseDown={() => handleSelectModelSuggestion(model)}
//                       >
//                         {model.model_name || model.name}
//                       </div>
//                     ))
//                   ) : (
//                     <div className="autocomplete-suggestion-item disabled">No matches found</div>
//                   )}
//                 </div>
//               )}
//             </div>
//           ) : (
//             // ------------------------------------------------------------
//             // Type = Colour -> pick a Model first, then colours for that
//             // model load from /colors/model/{id} as a dropdown
//             // ------------------------------------------------------------
//             <>
//               <div className="mb-3 autocomplete-field-wrap">
//                 <CFormLabel>
//                   Model<span className="required">*</span>
//                 </CFormLabel>
//                 <CFormInput
//                   value={colorModelQuery}
//                   onChange={(e) => handleColorModelQueryChange(e.target.value)}
//                   onFocus={() => {
//                     setShowColorModelSuggestions(true);
//                     searchModels(colorModelQuery, setColorModelSuggestions);
//                   }}
//                   onBlur={() => setTimeout(() => setShowColorModelSuggestions(false), 150)}
//                   placeholder="Search a model to load its colours"
//                   autoComplete="off"
//                 />
//                 {showColorModelSuggestions && (
//                   <div className="autocomplete-suggestions">
//                     {modelsLoading ? (
//                       <div className="autocomplete-suggestion-item disabled">Loading models…</div>
//                     ) : colorModelSuggestions.length > 0 ? (
//                       colorModelSuggestions.map((model) => (
//                         <div
//                           key={model.id || model._id}
//                           className="autocomplete-suggestion-item"
//                           onMouseDown={() => handleSelectColorModel(model)}
//                         >
//                           {model.model_name || model.name}
//                         </div>
//                       ))
//                     ) : (
//                       <div className="autocomplete-suggestion-item disabled">No matches found</div>
//                     )}
//                   </div>
//                 )}
//               </div>

//               <div className="mb-3">
//                 <CFormLabel>
//                   DMS Vehicle Colour<span className="required">*</span>
//                 </CFormLabel>
//                 <CFormSelect
//                   value={formDmsName}
//                   onChange={(e) => setFormDmsName(e.target.value)}
//                   disabled={colorsLoading}
//                 >
//                   <option value="">{colorsLoading ? 'Loading colours…' : '-Select a colour-'}</option>
//                   {/* Keep the currently-set value selectable even before a model is (re)picked, e.g. when editing */}
//                   {formDmsName && !colorOptions.some((c) => c.name === formDmsName) && (
//                     <option value={formDmsName}>{formDmsName}</option>
//                   )}
//                   {colorOptions.map((color) => (
//                     <option key={color.id || color._id} value={color.name}>
//                       {color.name}
//                     </option>
//                   ))}
//                 </CFormSelect>
//                 {!selectedColorModelId && !formDmsName && (
//                   <small className="text-muted">Select a model above to load its colours.</small>
//                 )}
//               </div>
//             </>
//           )}

//           <div className="mb-3">
//             <CFormLabel>
//               {formType === 'color' ? 'MIS Vehicle Colour' : 'MIS Vehicle Model'}
//             </CFormLabel>
//             <CFormInput
//               value={formMisName}
//               onChange={(e) => setFormMisName(e.target.value)}
//               placeholder={formType === 'color' ? 'e.g. WHITE PEARL' : 'e.g. ACTIVA-6G'}
//             />
//           </div>

//           <div className="mb-3">
//             <CFormLabel>Remarks</CFormLabel>
//             <CFormTextarea
//               value={formRemarks}
//               onChange={(e) => setFormRemarks(e.target.value)}
//               rows={2}
//             />
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={resetFormModal} disabled={formLoading}>
//             Cancel
//           </CButton>
//           <CButton className="submit-button" onClick={handleFormSubmit} disabled={formLoading}>
//             {formLoading ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 Saving...
//               </>
//             ) : (
//               'Save'
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Export Modal */}
//       <CModal visible={exportModalOpen} onClose={() => setExportModalOpen(false)}>
//         <CModalHeader>
//           <CModalTitle>Export Excel</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <CFormLabel>Type:</CFormLabel>
//             <CFormSelect value={exportType} onChange={(e) => setExportType(e.target.value)}>
//               <option value="color">Colour</option>
//               <option value="model">Model</option>
//             </CFormSelect>
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton className="submit-button" onClick={handleExport} disabled={exportLoading}>
//             {exportLoading ? 'Exporting...' : 'Export'}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Import Modal */}
//       <CModal visible={importModalOpen} onClose={resetImportModal}>
//         <CModalHeader>
//           <CModalTitle>Import Excel</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <CFormLabel>Type:</CFormLabel>
//             <CFormSelect value={importType} onChange={(e) => setImportType(e.target.value)}>
//               <option value="color">Colour</option>
//               <option value="model">Model</option>
//             </CFormSelect>
//           </div>

//           <div className="mb-3">
//             <CFormLabel>Select Excel/CSV File:</CFormLabel>
//             <CFormInput
//               type="file"
//               id="advance-mapping-import-file"
//               accept=".xlsx,.xls,.csv"
//               onChange={handleImportFileChange}
//             />
//             <small className="text-muted">Supported formats: .xlsx, .xls, .csv</small>
//           </div>

//           {importFile && (
//             <CAlert color="info">
//               Selected file: {importFile.name} ({(importFile.size / 1024).toFixed(2)} KB)
//             </CAlert>
//           )}

//           {importResult && (
//             <CAlert color={importResult.status === 'success' ? 'success' : 'warning'}>
//               <div className="d-flex align-items-center mb-2">
//                 <CIcon
//                   icon={importResult.status === 'success' ? cilCheckCircle : cilWarning}
//                   className="me-2"
//                 />
//                 {importResult.message}
//               </div>
//               {importResult.summary && (
//                 <ul className="mb-0">
//                   <li>Total rows: {importResult.summary.totalRows}</li>
//                   <li>Created: {importResult.summary.created}</li>
//                   <li>Updated: {importResult.summary.updated}</li>
//                   <li>Skipped: {importResult.summary.skipped}</li>
//                 </ul>
//               )}
//             </CAlert>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={resetImportModal} disabled={importLoading}>
//             Close
//           </CButton>
//           <CButton
//             className="submit-button"
//             onClick={handleImport}
//             disabled={!importFile || importLoading}
//           >
//             {importLoading ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 Importing...
//               </>
//             ) : (
//               'Import'
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </div>
//   );
// };

// export default AdvantageModelMapping;

//---------------------------------------------------------------------


// import '../../css/table.css';
// import '../../css/form.css';
// import {
//   React,
//   useState,
//   useEffect,
//   getDefaultSearchFields,
//   useTableFilter,
//   confirmDelete,
//   showError,
//   showSuccess,
//   axiosInstance
// } from '../../utils/tableImports';
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
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CFormSelect,
//   CFormTextarea,
//   CAlert,
//   CPagination,
//   CPaginationItem,
//   CNav,
//   CNavItem,
//   CNavLink,
//   CDropdown,
//   CDropdownToggle,
//   CDropdownMenu,
//   CDropdownItem
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import {
//   cilPlus,
//   cilSearch,
//   cilSettings,
//   cilPencil,
//   cilTrash,
//   cilCloudDownload,
//   cilCloudUpload,
//   cilCheckCircle,
//   cilWarning,
//   cilChevronLeft,
//   cilChevronRight
// } from '@coreui/icons';
// import { useNavigate } from 'react-router-dom';
// import { useRef } from 'react';

// const PAGE_SIZE_OPTIONS = [25, 50, 100];
// const DEFAULT_LIMIT = 25;

// const AdvantageModelMapping = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Server-side state
//   const [mappings, setMappings] = useState([]);
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: DEFAULT_LIMIT,
//     total: 0,
//     pages: 1
//   });

//   // Search / filter state
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterType, setFilterType] = useState('color');
//   const [filterVehicleType, setFilterVehicleType] = useState('');
//   const searchTimer = useRef(null);

//   // Add/Edit modal state
//   const [formModalOpen, setFormModalOpen] = useState(false);
//   const [formMode, setFormMode] = useState('add');
//   const [formType, setFormType] = useState('color');
//   const [formVehicleType, setFormVehicleType] = useState('EV');
//   const [formDmsName, setFormDmsName] = useState('');
//   const [formMisName, setFormMisName] = useState('');
//   const [formRemarks, setFormRemarks] = useState('');
//   const [editingId, setEditingId] = useState(null);
//   const [formLoading, setFormLoading] = useState(false);
//   const [formError, setFormError] = useState('');

//   // ---- Full model list, fetched once and filtered client-side ----
//   // (the /models API doesn't actually filter server-side on `search`, it
//   // returns the full list every time, so we cache it and filter locally)
//   const [allModels, setAllModels] = useState([]);
//   const [modelsLoaded, setModelsLoaded] = useState(false);
//   const [modelsLoading, setModelsLoading] = useState(false);
//   const modelsLoadPromise = useRef(null);

//   // ---- Model typeahead (used for Type = "model" DMS field) ----
//   const [modelSuggestions, setModelSuggestions] = useState([]);
//   const [showModelSuggestions, setShowModelSuggestions] = useState(false);
//   const modelSearchTimer = useRef(null);

//   // ---- Model picker used to scope colours (used for Type = "color") ----
//   const [colorModelQuery, setColorModelQuery] = useState('');
//   const [colorModelSuggestions, setColorModelSuggestions] = useState([]);
//   const [showColorModelSuggestions, setShowColorModelSuggestions] = useState(false);
//   const colorModelSearchTimer = useRef(null);
//   const [selectedColorModelId, setSelectedColorModelId] = useState(null);

//   const [colorOptions, setColorOptions] = useState([]);
//   const [colorsLoading, setColorsLoading] = useState(false);

//   // ---- MIS name suggestions, sourced from previously saved mis_name values ----
//   // (there's no separate MIS master API, so we build suggestions from the
//   // existing advance-model-mapping records, scoped by type, cached per type)
//   const [misNamesCache, setMisNamesCache] = useState({});
//   const [misNamesLoadingType, setMisNamesLoadingType] = useState(null);
//   const misNamesLoadPromise = useRef({});
//   const [misSuggestions, setMisSuggestions] = useState([]);
//   const [showMisSuggestions, setShowMisSuggestions] = useState(false);
//   const misSearchTimer = useRef(null);

//   // Export modal state
//   const [exportModalOpen, setExportModalOpen] = useState(false);
//   const [exportType, setExportType] = useState('color');
//   const [exportVehicleType, setExportVehicleType] = useState('');
//   const [exportLoading, setExportLoading] = useState(false);

//   // Import modal state
//   const [importModalOpen, setImportModalOpen] = useState(false);
//   const [importType, setImportType] = useState('color');
//   const [importFile, setImportFile] = useState(null);
//   const [importLoading, setImportLoading] = useState(false);
//   const [importResult, setImportResult] = useState(null);

//   const { permissions = [] } = useTableFilter ? { permissions: [] } : { permissions: [] };
//   const navigate = useNavigate();

//   const canView = true;
//   const canCreate = true;
//   const canUpdate = true;
//   const canDelete = true;

//   useEffect(() => {
//     fetchData();
//   }, [pagination.page, pagination.limit, filterType, filterVehicleType]);

//   useEffect(() => {
//     if (searchTimer.current) clearTimeout(searchTimer.current);
//     searchTimer.current = setTimeout(() => {
//       setPagination((prev) => ({ ...prev, page: 1 }));
//       fetchData(1, pagination.limit, searchTerm);
//     }, 500);
//     return () => {
//       if (searchTimer.current) clearTimeout(searchTimer.current);
//     };
//   }, [searchTerm]);

//   const fetchData = async (page = pagination.page, limit = pagination.limit, search = searchTerm) => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams();
//       params.append('page', page);
//       params.append('limit', limit);
//       if (search && search.trim()) params.append('search', search.trim());
//       if (filterType) params.append('type', filterType);
//       if (filterVehicleType) params.append('vehicle_type', filterVehicleType);

//       const response = await axiosInstance.get(`/advance-model-mapping?${params.toString()}`);
//       const body = response.data;

//       setMappings(body.data || []);
//       setPagination({
//         page: body.page || 1,
//         limit,
//         total: body.total || 0,
//         pages: body.pages || 1
//       });
//       setError(null);
//     } catch (err) {
//       const message = showError(err);
//       if (message) setError(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage < 1 || newPage > pagination.pages) return;
//     setPagination((prev) => ({ ...prev, page: newPage }));
//   };

//   const handleLimitChange = (newLimit) => {
//     setPagination((prev) => ({ ...prev, limit: parseInt(newLimit, 10), page: 1 }));
//   };

//   // ---------------------------------------------------------------------
//   // Model / Colour lookups (typeahead + colour-by-model)
//   // ---------------------------------------------------------------------
//   const extractList = (body, key) => {
//     if (!body) return [];
//     // API can return: a bare array, { data: [...] }, { data: { models: [...] } },
//     // or { models: [...] } — handle all of these.
//     if (Array.isArray(body)) return body;
//     if (Array.isArray(body?.data?.[key])) return body.data[key];
//     if (Array.isArray(body?.[key])) return body[key];
//     if (Array.isArray(body?.data)) return body.data;
//     return [];
//   };

//   // Fetches the full model list once and caches it (the API doesn't filter
//   // server-side, so we filter locally instead). Returns the cached/fetched list.
//   const loadAllModels = async () => {
//     if (modelsLoaded) return allModels;
//     if (modelsLoadPromise.current) return modelsLoadPromise.current;

//     setModelsLoading(true);
//     const promise = axiosInstance
//       .get('/models')
//       .then((response) => {
//         const list = extractList(response.data, 'models');
//         setAllModels(list);
//         setModelsLoaded(true);
//         return list;
//       })
//       .catch(() => {
//         setAllModels([]);
//         return [];
//       })
//       .finally(() => {
//         setModelsLoading(false);
//         modelsLoadPromise.current = null;
//       });

//     modelsLoadPromise.current = promise;
//     return promise;
//   };

//   const filterModels = (list, query) => {
//     const q = (query || '').trim().toLowerCase();
//     if (!q) return list.slice(0, 20);
//     return list.filter((m) => (m.model_name || m.name || '').toLowerCase().includes(q)).slice(0, 20);
//   };

//   const searchModels = async (query, setSuggestions) => {
//     const list = await loadAllModels();
//     setSuggestions(filterModels(list, query));
//   };

//   const fetchColorsForModel = async (modelId) => {
//     if (!modelId) {
//       setColorOptions([]);
//       return;
//     }
//     try {
//       setColorsLoading(true);
//       const response = await axiosInstance.get(`/colors/model/${modelId}`);
//       const list = extractList(response.data, 'colors');
//       setColorOptions(Array.isArray(list) ? list : []);
//     } catch (err) {
//       setColorOptions([]);
//     } finally {
//       setColorsLoading(false);
//     }
//   };

//   // Loads (and caches) the distinct mis_name values already saved for a given
//   // mapping type, from GET /advance-model-mapping?type=...&limit=1000
//   const loadMisNames = async (type) => {
//     if (misNamesCache[type]) return misNamesCache[type];
//     if (misNamesLoadPromise.current[type]) return misNamesLoadPromise.current[type];

//     setMisNamesLoadingType(type);
//     const promise = axiosInstance
//       .get(`/advance-model-mapping?page=1&limit=1000&type=${type}`)
//       .then((response) => {
//         const rows = response.data?.data || [];
//         const names = Array.from(
//           new Set(rows.map((r) => (r.mis_name || '').trim()).filter(Boolean))
//         ).sort((a, b) => a.localeCompare(b));
//         setMisNamesCache((prev) => ({ ...prev, [type]: names }));
//         return names;
//       })
//       .catch(() => [])
//       .finally(() => {
//         setMisNamesLoadingType((prev) => (prev === type ? null : prev));
//         delete misNamesLoadPromise.current[type];
//       });

//     misNamesLoadPromise.current[type] = promise;
//     return promise;
//   };

//   const filterStrings = (list, query) => {
//     const q = (query || '').trim().toLowerCase();
//     if (!q) return list.slice(0, 20);
//     return list.filter((v) => v.toLowerCase().includes(q)).slice(0, 20);
//   };

//   const searchMisNames = async (type, query, setSuggestions) => {
//     const list = await loadMisNames(type);
//     setSuggestions(filterStrings(list, query));
//   };

//   const handleMisNameInputChange = (value) => {
//     setFormMisName(value);
//     setShowMisSuggestions(true);
//     if (misSearchTimer.current) clearTimeout(misSearchTimer.current);
//     misSearchTimer.current = setTimeout(() => {
//       searchMisNames(formType, value, setMisSuggestions);
//     }, 200);
//   };

//   const handleSelectMisSuggestion = (name) => {
//     setFormMisName(name);
//     setShowMisSuggestions(false);
//     setMisSuggestions([]);
//   };

//   // DMS Vehicle Model field (Type = "model") — typeahead as the user types
//   const handleDmsModelInputChange = (value) => {
//     setFormDmsName(value);
//     setShowModelSuggestions(true);
//     if (modelSearchTimer.current) clearTimeout(modelSearchTimer.current);
//     modelSearchTimer.current = setTimeout(() => {
//       searchModels(value, setModelSuggestions);
//     }, 200);
//   };

//   const handleSelectModelSuggestion = (model) => {
//     setFormDmsName(model.model_name || model.name);
//     setShowModelSuggestions(false);
//     setModelSuggestions([]);
//   };

//   // Model picker used to scope the colour dropdown (Type = "color")
//   const handleColorModelQueryChange = (value) => {
//     setColorModelQuery(value);
//     setSelectedColorModelId(null);
//     setColorOptions([]);
//     setFormDmsName('');
//     setShowColorModelSuggestions(true);
//     if (colorModelSearchTimer.current) clearTimeout(colorModelSearchTimer.current);
//     colorModelSearchTimer.current = setTimeout(() => {
//       searchModels(value, setColorModelSuggestions);
//     }, 200);
//   };

//   const handleSelectColorModel = (model) => {
//     const modelId = model.id || model._id;
//     setColorModelQuery(model.model_name || model.name);
//     setSelectedColorModelId(modelId);
//     setShowColorModelSuggestions(false);
//     setColorModelSuggestions([]);
//     setFormDmsName('');
//     fetchColorsForModel(modelId);
//   };

//   const resetLookupState = () => {
//     setModelSuggestions([]);
//     setShowModelSuggestions(false);
//     setColorModelQuery('');
//     setColorModelSuggestions([]);
//     setShowColorModelSuggestions(false);
//     setSelectedColorModelId(null);
//     setColorOptions([]);
//     setColorsLoading(false);
//     setMisSuggestions([]);
//     setShowMisSuggestions(false);
//   };

//   // ---------------------------------------------------------------------
//   // Add / Edit - FIXED to use the correct endpoint
//   // ---------------------------------------------------------------------
//   const openAddModal = () => {
//     if (!canCreate) {
//       showError('You do not have permission to add mappings');
//       return;
//     }
//     setFormMode('add');
//     setFormType(filterType || 'color');
//     setFormVehicleType(filterVehicleType || 'EV');
//     setFormDmsName('');
//     setFormMisName('');
//     setFormRemarks('');
//     setEditingId(null);
//     setFormError('');
//     resetLookupState();
//     setFormModalOpen(true);
//   };

//   const openEditModal = (mapping) => {
//     if (!canUpdate) {
//       showError('You do not have permission to edit mappings');
//       return;
//     }
//     setFormMode('edit');
//     setFormType(mapping.type);
//     setFormVehicleType(mapping.vehicle_type || 'EV');
//     setFormDmsName(mapping.dms_name);
//     setFormMisName(mapping.mis_name || '');
//     setFormRemarks(mapping.remarks || '');
//     setEditingId(mapping._id);
//     setFormError('');
//     resetLookupState();
//     setFormModalOpen(true);
//   };

//   const resetFormModal = () => {
//     setFormModalOpen(false);
//     setFormError('');
//   };

//   const handleFormTypeChange = (newType) => {
//     setFormType(newType);
//     setFormDmsName('');
//     setFormMisName('');
//     resetLookupState();
//   };

//   const handleFormSubmit = async () => {
//     if (!formVehicleType) {
//       setFormError('Vehicle type is required');
//       return;
//     }
//     if (!formDmsName.trim()) {
//       setFormError(formType === 'color' ? 'DMS colour is required' : 'DMS name is required');
//       return;
//     }

//     setFormLoading(true);
//     setFormError('');
//     try {
//       if (formMode === 'add') {
//         // FIXED: Use the single create endpoint instead of bulk
//         await axiosInstance.post('/advance-model-mapping', {
//           type: formType,
//           vehicle_type: formVehicleType,
//           dms_name: formDmsName.trim(),
//           mis_name: formMisName.trim() || undefined,
//           remarks: formRemarks.trim() || undefined
//         });
//         showSuccess('Mapping added successfully!');
//       } else {
//         await axiosInstance.put(`/advance-model-mapping/${editingId}`, {
//           type: formType,
//           vehicle_type: formVehicleType,
//           dms_name: formDmsName.trim(),
//           mis_name: formMisName.trim() || null,
//           remarks: formRemarks.trim() || null
//         });
//         showSuccess('Mapping updated successfully!');
//       }
//       resetFormModal();
//       fetchData();
//     } catch (err) {
//       const message = err.response?.data?.message || 'Failed to save mapping';
//       setFormError(message);
//       showError(message);
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   // ---------------------------------------------------------------------
//   // Delete
//   // ---------------------------------------------------------------------
//   const handleDelete = async (id) => {
//     if (!canDelete) {
//       showError('You do not have permission to delete mappings');
//       return;
//     }
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/advance-model-mapping/${id}`);
//         showSuccess('Mapping deactivated successfully!');
//         fetchData();
//       } catch (err) {
//         showError(err.response?.data?.message || 'Failed to delete mapping');
//       }
//     }
//   };

//   // ---------------------------------------------------------------------
//   // Export
//   // ---------------------------------------------------------------------
//   const handleExport = async () => {
//     setExportLoading(true);
//     try {
//       const params = new URLSearchParams();
//       params.append('type', exportType);
//       if (exportVehicleType) params.append('vehicle_type', exportVehicleType);

//       const response = await axiosInstance.get(
//         `/advance-model-mapping/export?${params.toString()}`,
//         { responseType: 'blob' }
//       );

//       const blob = new Blob([response.data], {
//         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//       });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute(
//         'download',
//         `Advance_Model_Mapping_${exportType}_${new Date().toLocaleDateString()}.xlsx`
//       );
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);

//       setExportModalOpen(false);
//       showSuccess('Excel exported successfully!');
//     } catch (err) {
//       console.error('Export failed:', err);
//       showError('Failed to export Excel');
//     } finally {
//       setExportLoading(false);
//     }
//   };

//   // ---------------------------------------------------------------------
//   // Import
//   // ---------------------------------------------------------------------
//   const handleImportFileChange = (e) => {
//     setImportFile(e.target.files[0]);
//   };

//   const resetImportModal = () => {
//     setImportModalOpen(false);
//     setImportFile(null);
//     setImportResult(null);
//   };

//   const handleImport = async () => {
//     if (!importFile) {
//       showError('Please select a file');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', importFile);
//     formData.append('type', importType);

//     setImportLoading(true);
//     setImportResult(null);
//     try {
//       const response = await axiosInstance.post('/advance-model-mapping/import', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
//       setImportResult(response.data);
//       showSuccess(response.data.message || 'Import completed');
//       fetchData();
//     } catch (err) {
//       const message = err.response?.data?.message || 'Failed to import file';
//       showError(message);
//       setImportResult(err.response?.data || null);
//     } finally {
//       setImportLoading(false);
//     }
//   };

//   if (loading && mappings.length === 0) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" />
//       </div>
//     );
//   }

//   if (!canView) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Advance Model Mapping.
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="alert alert-danger" role="alert">
//         {error}
//       </div>
//     );
//   }

//   const startRecord = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
//   const endRecord = Math.min(pagination.page * pagination.limit, pagination.total);

//   let startPage = Math.max(1, pagination.page - 2);
//   let endPage = Math.min(pagination.pages, pagination.page + 2);
//   if (pagination.page <= 3) endPage = Math.min(5, pagination.pages);
//   if (pagination.page >= pagination.pages - 2) startPage = Math.max(1, pagination.pages - 4);
//   const displayedPages = [];
//   for (let i = startPage; i <= endPage; i++) displayedPages.push(i);

//   return (
//     <div>
//       <style>{`
//         .advance-mapping-tabs .nav-link {
//           color: #6b7280;
//           font-weight: 500;
//           border-bottom: 2px solid transparent;
//           padding: 8px 16px;
//         }
//         .advance-mapping-tabs .nav-link.active {
//           color: #2563eb;
//           font-weight: 600;
//           border-bottom: 2px solid #2563eb;
//           background: transparent;
//         }
//         .advance-mapping-tabs .nav-link:hover {
//           color: #2563eb;
//         }

//         .pill-action-btn {
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           border-radius: 6px;
//           padding: 5px 12px;
//           font-size: 13px;
//           font-weight: 500;
//           border: none;
//           line-height: 1.4;
//         }
//         .pill-action-btn svg,
//         .pill-action-btn .c-icon,
//         .pill-action-btn .icon {
//           width: 15px;
//           height: 15px;
//         }
//         .pill-action-btn-primary {
//           background-color: #2563eb;
//           color: #fff;
//         }
//         .pill-action-btn-primary:hover {
//           background-color: #1d4ed8;
//           color: #fff;
//         }
//         .pill-action-btn-outline {
//           background-color: #fff;
//           color: #374151;
//           border: 1px solid #d1d5db;
//         }
//         .pill-action-btn-outline:hover {
//           background-color: #f3f4f6;
//           color: #374151;
//         }

//         .options-dropdown-btn {
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           gap: 6px;
//           border-radius: 6px;
//           padding: 5px 12px;
//           font-size: 13px;
//           font-weight: 500;
//           background-color: #fff;
//           color: #374151;
//           border: 1px solid #d1d5db;
//         }
//         .options-dropdown-btn:hover,
//         .options-dropdown-btn:focus,
//         .options-dropdown-btn:active {
//           background-color: #f3f4f6 !important;
//           color: #374151 !important;
//           border-color: #d1d5db !important;
//         }
//         .options-dropdown-btn::after {
//           display: none;
//         }
//         .options-dropdown-menu .dropdown-item {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           font-size: 13px;
//           padding: 8px 14px;
//         }
//         .options-dropdown-menu .dropdown-item.text-danger:hover {
//           background-color: #fef2f2;
//         }

//         .autocomplete-field-wrap {
//           position: relative;
//         }
//         .autocomplete-suggestions {
//           position: absolute;
//           top: 100%;
//           left: 0;
//           right: 0;
//           z-index: 1060;
//           background: #fff;
//           border: 1px solid #d1d5db;
//           border-top: none;
//           border-radius: 0 0 6px 6px;
//           max-height: 220px;
//           overflow-y: auto;
//           box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
//         }
//         .autocomplete-suggestion-item {
//           padding: 8px 12px;
//           font-size: 14px;
//           cursor: pointer;
//         }
//         .autocomplete-suggestion-item:hover {
//           background-color: #f3f4f6;
//         }
//         .autocomplete-suggestion-item.disabled {
//           cursor: default;
//           color: #9ca3af;
//         }
//         .autocomplete-suggestion-item.disabled:hover {
//           background-color: transparent;
//         }
//       `}</style>
//       <div className="title">Advance Model Mapping</div>

//       <CCard className="table-container mt-4">
//         <CCardHeader className="card-header d-flex justify-content-between align-items-center">
//           <div>
//             {canCreate && (
//               <CButton size="sm" className="action-btn me-1" onClick={openAddModal}>
//                 <CIcon icon={cilPlus} className="icon" /> New Mapping
//               </CButton>
//             )}

//             <CButton
//               size="sm"
//               className="action-btn me-1"
//               onClick={() => setExportModalOpen(true)}
//             >
//               <CIcon icon={cilCloudDownload} className="icon" /> Export Excel
//             </CButton>

//             {canCreate && (
//               <CButton
//                 size="sm"
//                 className="action-btn me-1"
//                 onClick={() => setImportModalOpen(true)}
//               >
//                 <CIcon icon={cilCloudUpload} className="icon" /> Import Excel
//               </CButton>
//             )}
//           </div>
//         </CCardHeader>

//         <CCardBody>
//           <CNav variant="underline" className="mb-3 advance-mapping-tabs">
//             <CNavItem>
//               <CNavLink
//                 active={filterType === 'color'}
//                 onClick={() => {
//                   setFilterType('color');
//                   setPagination((prev) => ({ ...prev, page: 1 }));
//                 }}
//                 style={{ cursor: 'pointer' }}
//               >
//                 Colour
//               </CNavLink>
//             </CNavItem>
//             <CNavItem>
//               <CNavLink
//                 active={filterType === 'model'}
//                 onClick={() => {
//                   setFilterType('model');
//                   setPagination((prev) => ({ ...prev, page: 1 }));
//                 }}
//                 style={{ cursor: 'pointer' }}
//               >
//                 Model
//               </CNavLink>
//             </CNavItem>
//           </CNav>

//           <div className="d-flex justify-content-between mb-3 align-items-center flex-wrap gap-2">
//             <div className="d-flex align-items-center">
//               <CFormLabel className="mb-0 me-2">Rows per page:</CFormLabel>
//               <CFormSelect
//                 value={pagination.limit}
//                 onChange={(e) => handleLimitChange(e.target.value)}
//                 style={{ width: '80px' }}
//                 size="sm"
//               >
//                 {PAGE_SIZE_OPTIONS.map((option) => (
//                   <option key={option} value={option}>
//                     {option}
//                   </option>
//                 ))}
//               </CFormSelect>

//               <CFormLabel className="mb-0 ms-3 me-2">Vehicle Type:</CFormLabel>
//               <CFormSelect
//                 value={filterVehicleType}
//                 onChange={(e) => {
//                   setFilterVehicleType(e.target.value);
//                   setPagination((prev) => ({ ...prev, page: 1 }));
//                 }}
//                 style={{ width: '110px' }}
//                 size="sm"
//               >
//                 <option value="">All</option>
//                 <option value="EV">EV</option>
//                 <option value="ICE">ICE</option>
//               </CFormSelect>
//             </div>

//             <div className="d-flex align-items-center">
//               <CFormLabel className="mt-1 m-1">Search:</CFormLabel>
//               <CFormInput
//                 type="text"
//                 className="d-inline-block square-search"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search by DMS or MIS name..."
//                 style={{ width: '250px' }}
//               />
//             </div>
//           </div>

//           {loading && (
//             <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
//               <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
//             </div>
//           )}

//           <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
//             <CTable striped bordered hover className="responsive-table">
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Type</CTableHeaderCell>
//                   <CTableHeaderCell>Vehicle Type</CTableHeaderCell>
//                   <CTableHeaderCell>DMS Name</CTableHeaderCell>
//                   <CTableHeaderCell>MIS Name</CTableHeaderCell>
//                   <CTableHeaderCell>Remarks</CTableHeaderCell>
//                   <CTableHeaderCell>Status</CTableHeaderCell>
//                   {(canUpdate || canDelete) && <CTableHeaderCell>Action</CTableHeaderCell>}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {mappings.length === 0 && !loading ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan={(canUpdate || canDelete) ? '8' : '7'} className="text-center">
//                       {searchTerm ? `No results found for "${searchTerm}"` : 'No mappings available'}
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   mappings.map((mapping, index) => {
//                     const globalIndex = (pagination.page - 1) * pagination.limit + index + 1;
//                     return (
//                       <CTableRow key={mapping._id}>
//                         <CTableDataCell>{globalIndex}</CTableDataCell>
//                         <CTableDataCell>
//                           <CBadge color={mapping.type === 'color' ? 'info' : 'primary'}>
//                             {mapping.type === 'color' ? 'Colour' : 'Model'}
//                           </CBadge>
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {mapping.vehicle_type ? (
//                             <CBadge color={mapping.vehicle_type === 'EV' ? 'success' : 'warning'}>
//                               {mapping.vehicle_type}
//                             </CBadge>
//                           ) : (
//                             '—'
//                           )}
//                         </CTableDataCell>
//                         <CTableDataCell>{mapping.dms_name}</CTableDataCell>
//                         <CTableDataCell>{mapping.mis_name || '—'}</CTableDataCell>
//                         <CTableDataCell>{mapping.remarks || '—'}</CTableDataCell>
//                         <CTableDataCell>
//                           <CBadge color={mapping.status === 'active' ? 'success' : 'secondary'}>
//                             {mapping.status}
//                           </CBadge>
//                         </CTableDataCell>
//                         {(canUpdate || canDelete) && (
//                           <CTableDataCell>
//                             <CDropdown alignment="end">
//                               <CDropdownToggle
//                                 size="sm"
//                                 className="options-dropdown-btn"
//                                 caret={false}
//                               >
//                                 <CIcon icon={cilSettings} />
//                                 Options
//                               </CDropdownToggle>
//                               <CDropdownMenu className="options-dropdown-menu">
//                                 {canUpdate && (
//                                   <CDropdownItem
//                                     style={{ cursor: 'pointer' }}
//                                     onClick={() => openEditModal(mapping)}
//                                   >
//                                     <CIcon icon={cilPencil} />
//                                     Edit
//                                   </CDropdownItem>
//                                 )}
//                                 {canDelete && (
//                                   <CDropdownItem
//                                     className="text-danger"
//                                     style={{ cursor: 'pointer' }}
//                                     onClick={() => handleDelete(mapping._id)}
//                                   >
//                                     <CIcon icon={cilTrash} />
//                                     Delete
//                                   </CDropdownItem>
//                                 )}
//                               </CDropdownMenu>
//                             </CDropdown>
//                           </CTableDataCell>
//                         )}
//                       </CTableRow>
//                     );
//                   })
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>

//           {pagination.total > 0 && (
//             <div className="mt-4">
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <span className="text-muted" style={{ fontSize: '13px' }}>
//                   {loading ? 'Loading…' : `Showing ${startRecord}–${endRecord} of ${pagination.total} records`}
//                 </span>
//               </div>

//               {pagination.pages > 1 && (
//                 <CPagination align="center" aria-label="Page navigation">
//                   <CPaginationItem
//                     aria-label="Previous"
//                     onClick={() => handlePageChange(pagination.page - 1)}
//                     disabled={pagination.page === 1 || loading}
//                   >
//                     <CIcon icon={cilChevronLeft} />
//                   </CPaginationItem>

//                   {displayedPages.map((page) => (
//                     <CPaginationItem
//                       key={page}
//                       onClick={() => handlePageChange(page)}
//                       active={pagination.page === page}
//                       disabled={loading}
//                     >
//                       {page}
//                     </CPaginationItem>
//                   ))}

//                   <CPaginationItem
//                     aria-label="Next"
//                     onClick={() => handlePageChange(pagination.page + 1)}
//                     disabled={pagination.page === pagination.pages || loading}
//                   >
//                     <CIcon icon={cilChevronRight} />
//                   </CPaginationItem>
//                 </CPagination>
//               )}
//             </div>
//           )}
//         </CCardBody>
//       </CCard>

//       {/* Add / Edit Modal */}
//       <CModal visible={formModalOpen} onClose={resetFormModal}>
//         <CModalHeader>
//           <CModalTitle>{formMode === 'add' ? 'Add Mapping' : 'Edit Mapping'}</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {formError && <CAlert color="danger">{formError}</CAlert>}

//           <div className="mb-3">
//             <CFormLabel>Type<span className="required">*</span></CFormLabel>
//             <CFormSelect
//               value={formType}
//               onChange={(e) => handleFormTypeChange(e.target.value)}
//               disabled={formMode === 'edit'}
//             >
//               <option value="color">Colour</option>
//               <option value="model">Model</option>
//             </CFormSelect>
//           </div>

//           <div className="mb-3">
//             <CFormLabel>Vehicle Type<span className="required">*</span></CFormLabel>
//             <CFormSelect
//               value={formVehicleType}
//               onChange={(e) => setFormVehicleType(e.target.value)}
//             >
//               <option value="EV">EV</option>
//               <option value="ICE">ICE</option>
//             </CFormSelect>
//           </div>

//           {formType === 'model' ? (
//             // ------------------------------------------------------------
//             // Type = Model -> DMS field is a typeahead against /models
//             // ------------------------------------------------------------
//             <div className="mb-3 autocomplete-field-wrap">
//               <CFormLabel>
//                 DMS Vehicle Model<span className="required">*</span>
//               </CFormLabel>
//               <CFormInput
//                 value={formDmsName}
//                 onChange={(e) => handleDmsModelInputChange(e.target.value)}
//                 onFocus={() => {
//                   setShowModelSuggestions(true);
//                   searchModels(formDmsName, setModelSuggestions);
//                 }}
//                 onBlur={() => setTimeout(() => setShowModelSuggestions(false), 150)}
//                 placeholder="e.g. Activa 6G"
//                 autoComplete="off"
//               />
//               {showModelSuggestions && (
//                 <div className="autocomplete-suggestions">
//                   {modelsLoading ? (
//                     <div className="autocomplete-suggestion-item disabled">Loading models…</div>
//                   ) : modelSuggestions.length > 0 ? (
//                     modelSuggestions.map((model) => (
//                       <div
//                         key={model.id || model._id}
//                         className="autocomplete-suggestion-item"
//                         onMouseDown={() => handleSelectModelSuggestion(model)}
//                       >
//                         {model.model_name || model.name}
//                       </div>
//                     ))
//                   ) : (
//                     <div className="autocomplete-suggestion-item disabled">No matches found</div>
//                   )}
//                 </div>
//               )}
//             </div>
//           ) : (
//             // ------------------------------------------------------------
//             // Type = Colour -> pick a Model first, then colours for that
//             // model load from /colors/model/{id} as a dropdown
//             // ------------------------------------------------------------
//             <>
//               <div className="mb-3 autocomplete-field-wrap">
//                 <CFormLabel>
//                   Model<span className="required">*</span>
//                 </CFormLabel>
//                 <CFormInput
//                   value={colorModelQuery}
//                   onChange={(e) => handleColorModelQueryChange(e.target.value)}
//                   onFocus={() => {
//                     setShowColorModelSuggestions(true);
//                     searchModels(colorModelQuery, setColorModelSuggestions);
//                   }}
//                   onBlur={() => setTimeout(() => setShowColorModelSuggestions(false), 150)}
//                   placeholder="Search a model to load its colours"
//                   autoComplete="off"
//                 />
//                 {showColorModelSuggestions && (
//                   <div className="autocomplete-suggestions">
//                     {modelsLoading ? (
//                       <div className="autocomplete-suggestion-item disabled">Loading models…</div>
//                     ) : colorModelSuggestions.length > 0 ? (
//                       colorModelSuggestions.map((model) => (
//                         <div
//                           key={model.id || model._id}
//                           className="autocomplete-suggestion-item"
//                           onMouseDown={() => handleSelectColorModel(model)}
//                         >
//                           {model.model_name || model.name}
//                         </div>
//                       ))
//                     ) : (
//                       <div className="autocomplete-suggestion-item disabled">No matches found</div>
//                     )}
//                   </div>
//                 )}
//               </div>

//               <div className="mb-3">
//                 <CFormLabel>
//                   DMS Vehicle Colour<span className="required">*</span>
//                 </CFormLabel>
//                 <CFormSelect
//                   value={formDmsName}
//                   onChange={(e) => setFormDmsName(e.target.value)}
//                   disabled={colorsLoading}
//                 >
//                   <option value="">{colorsLoading ? 'Loading colours…' : '-Select a colour-'}</option>
//                   {/* Keep the currently-set value selectable even before a model is (re)picked, e.g. when editing */}
//                   {formDmsName && !colorOptions.some((c) => c.name === formDmsName) && (
//                     <option value={formDmsName}>{formDmsName}</option>
//                   )}
//                   {colorOptions.map((color) => (
//                     <option key={color.id || color._id} value={color.name}>
//                       {color.name}
//                     </option>
//                   ))}
//                 </CFormSelect>
//                 {!selectedColorModelId && !formDmsName && (
//                   <small className="text-muted">Select a model above to load its colours.</small>
//                 )}
//               </div>
//             </>
//           )}

//           <div className="mb-3 autocomplete-field-wrap">
//             <CFormLabel>
//               {formType === 'color' ? 'MIS Vehicle Colour' : 'MIS Vehicle Model'}
//             </CFormLabel>
//             <CFormInput
//               value={formMisName}
//               onChange={(e) => handleMisNameInputChange(e.target.value)}
//               onFocus={() => {
//                 setShowMisSuggestions(true);
//                 searchMisNames(formType, formMisName, setMisSuggestions);
//               }}
//               onBlur={() => setTimeout(() => setShowMisSuggestions(false), 150)}
//               placeholder={formType === 'color' ? 'e.g. WHITE PEARL' : 'e.g. ACTIVA-6G'}
//               autoComplete="off"
//             />
//             {showMisSuggestions && (
//               <div className="autocomplete-suggestions">
//                 {misNamesLoadingType === formType ? (
//                   <div className="autocomplete-suggestion-item disabled">Loading…</div>
//                 ) : misSuggestions.length > 0 ? (
//                   misSuggestions.map((name) => (
//                     <div
//                       key={name}
//                       className="autocomplete-suggestion-item"
//                       onMouseDown={() => handleSelectMisSuggestion(name)}
//                     >
//                       {name}
//                     </div>
//                   ))
//                 ) : (
//                   <div className="autocomplete-suggestion-item disabled">
//                     No previously used values found
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           <div className="mb-3">
//             <CFormLabel>Remarks</CFormLabel>
//             <CFormTextarea
//               value={formRemarks}
//               onChange={(e) => setFormRemarks(e.target.value)}
//               rows={2}
//             />
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={resetFormModal} disabled={formLoading}>
//             Cancel
//           </CButton>
//           <CButton className="submit-button" onClick={handleFormSubmit} disabled={formLoading}>
//             {formLoading ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 Saving...
//               </>
//             ) : (
//               'Save'
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Export Modal */}
//       <CModal visible={exportModalOpen} onClose={() => setExportModalOpen(false)}>
//         <CModalHeader>
//           <CModalTitle>Export Excel</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <CFormLabel>Type:</CFormLabel>
//             <CFormSelect value={exportType} onChange={(e) => setExportType(e.target.value)}>
//               <option value="color">Colour</option>
//               <option value="model">Model</option>
//             </CFormSelect>
//           </div>

//           <div className="mb-3">
//             <CFormLabel>Vehicle Type:</CFormLabel>
//             <CFormSelect
//               value={exportVehicleType}
//               onChange={(e) => setExportVehicleType(e.target.value)}
//             >
//               <option value="">All</option>
//               <option value="EV">EV</option>
//               <option value="ICE">ICE</option>
//             </CFormSelect>
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton className="submit-button" onClick={handleExport} disabled={exportLoading}>
//             {exportLoading ? 'Exporting...' : 'Export'}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Import Modal */}
//       <CModal visible={importModalOpen} onClose={resetImportModal}>
//         <CModalHeader>
//           <CModalTitle>Import Excel</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <CFormLabel>Type:</CFormLabel>
//             <CFormSelect value={importType} onChange={(e) => setImportType(e.target.value)}>
//               <option value="color">Colour</option>
//               <option value="model">Model</option>
//             </CFormSelect>
//           </div>

//           <div className="mb-3">
//             <CFormLabel>Select Excel/CSV File:</CFormLabel>
//             <CFormInput
//               type="file"
//               id="advance-mapping-import-file"
//               accept=".xlsx,.xls,.csv"
//               onChange={handleImportFileChange}
//             />
//             <small className="text-muted">Supported formats: .xlsx, .xls, .csv</small>
//           </div>

//           {importFile && (
//             <CAlert color="info">
//               Selected file: {importFile.name} ({(importFile.size / 1024).toFixed(2)} KB)
//             </CAlert>
//           )}

//           {importResult && (
//             <CAlert color={importResult.status === 'success' ? 'success' : 'warning'}>
//               <div className="d-flex align-items-center mb-2">
//                 <CIcon
//                   icon={importResult.status === 'success' ? cilCheckCircle : cilWarning}
//                   className="me-2"
//                 />
//                 {importResult.message}
//               </div>
//               {importResult.summary && (
//                 <ul className="mb-0">
//                   <li>Total rows: {importResult.summary.totalRows}</li>
//                   <li>Created: {importResult.summary.created}</li>
//                   <li>Updated: {importResult.summary.updated}</li>
//                   <li>Skipped: {importResult.summary.skipped}</li>
//                 </ul>
//               )}
//             </CAlert>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={resetImportModal} disabled={importLoading}>
//             Close
//           </CButton>
//           <CButton
//             className="submit-button"
//             onClick={handleImport}
//             disabled={!importFile || importLoading}
//           >
//             {importLoading ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 Importing...
//               </>
//             ) : (
//               'Import'
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </div>
//   );
// };

// export default AdvantageModelMapping;


// import '../../css/table.css';
// import '../../css/form.css';
// import {
//   React,
//   useState,
//   useEffect,
//   getDefaultSearchFields,
//   useTableFilter,
//   confirmDelete,
//   showError,
//   showSuccess,
//   axiosInstance
// } from '../../utils/tableImports';
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
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CFormSelect,
//   CFormTextarea,
//   CAlert,
//   CPagination,
//   CPaginationItem,
//   CNav,
//   CNavItem,
//   CNavLink,
//   CDropdown,
//   CDropdownToggle,
//   CDropdownMenu,
//   CDropdownItem
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import {
//   cilPlus,
//   cilSearch,
//   cilSettings,
//   cilPencil,
//   cilTrash,
//   cilCloudDownload,
//   cilCloudUpload,
//   cilCheckCircle,
//   cilWarning,
//   cilChevronLeft,
//   cilChevronRight
// } from '@coreui/icons';
// import { useNavigate } from 'react-router-dom';
// import { useRef } from 'react';
// import Select from 'react-select';

// const PAGE_SIZE_OPTIONS = [25, 50, 100];
// const DEFAULT_LIMIT = 25;

// const AdvantageModelMapping = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Server-side state
//   const [mappings, setMappings] = useState([]);
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: DEFAULT_LIMIT,
//     total: 0,
//     pages: 1
//   });

//   // Search / filter state
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterType, setFilterType] = useState('color');
//   const [filterVehicleType, setFilterVehicleType] = useState('');
//   const searchTimer = useRef(null);

//   // Add/Edit modal state
//   const [formModalOpen, setFormModalOpen] = useState(false);
//   const [formMode, setFormMode] = useState('add');
//   const [formType, setFormType] = useState('color');
//   const [formVehicleType, setFormVehicleType] = useState('EV');
//   const [formDmsName, setFormDmsName] = useState('');
//   const [formMisName, setFormMisName] = useState('');
//   const [formRemarks, setFormRemarks] = useState('');
//   const [editingId, setEditingId] = useState(null);
//   const [formLoading, setFormLoading] = useState(false);
//   const [formError, setFormError] = useState('');

//   // ---- Full model list, fetched once and filtered client-side by Vehicle Type ----
//   // (the /models API doesn't filter server-side, so we cache the full list and
//   // filter locally by formVehicleType, exactly like InwardStock does)
//   const [allModels, setAllModels] = useState([]);
//   const [modelsLoaded, setModelsLoaded] = useState(false);
//   const [modelsLoading, setModelsLoading] = useState(false);
//   const modelsLoadPromise = useRef(null);

//   // Selected model for Type = "color" (used to load its colours)
//   const [selectedColorModelId, setSelectedColorModelId] = useState(null);
//   const [colorOptions, setColorOptions] = useState([]);
//   const [colorsLoading, setColorsLoading] = useState(false);

//   // ---- MIS name suggestions, sourced from previously saved mis_name values ----
//   const [misNamesCache, setMisNamesCache] = useState({});
//   const [misNamesLoadingType, setMisNamesLoadingType] = useState(null);
//   const misNamesLoadPromise = useRef({});
//   const [misSuggestions, setMisSuggestions] = useState([]);
//   const [showMisSuggestions, setShowMisSuggestions] = useState(false);
//   const misSearchTimer = useRef(null);

//   // Export modal state
//   const [exportModalOpen, setExportModalOpen] = useState(false);
//   const [exportType, setExportType] = useState('color');
//   const [exportVehicleType, setExportVehicleType] = useState('');
//   const [exportLoading, setExportLoading] = useState(false);

//   // Import modal state
//   const [importModalOpen, setImportModalOpen] = useState(false);
//   const [importType, setImportType] = useState('color');
//   const [importFile, setImportFile] = useState(null);
//   const [importLoading, setImportLoading] = useState(false);
//   const [importResult, setImportResult] = useState(null);

//   const { permissions = [] } = useTableFilter ? { permissions: [] } : { permissions: [] };
//   const navigate = useNavigate();

//   const canView = true;
//   const canCreate = true;
//   const canUpdate = true;
//   const canDelete = true;

//   useEffect(() => {
//     fetchData();
//   }, [pagination.page, pagination.limit, filterType, filterVehicleType]);

//   useEffect(() => {
//     if (searchTimer.current) clearTimeout(searchTimer.current);
//     searchTimer.current = setTimeout(() => {
//       setPagination((prev) => ({ ...prev, page: 1 }));
//       fetchData(1, pagination.limit, searchTerm);
//     }, 500);
//     return () => {
//       if (searchTimer.current) clearTimeout(searchTimer.current);
//     };
//   }, [searchTerm]);

//   const fetchData = async (page = pagination.page, limit = pagination.limit, search = searchTerm) => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams();
//       params.append('page', page);
//       params.append('limit', limit);
//       if (search && search.trim()) params.append('search', search.trim());
//       if (filterType) params.append('type', filterType);
//       if (filterVehicleType) params.append('vehicle_type', filterVehicleType);

//       const response = await axiosInstance.get(`/advance-model-mapping?${params.toString()}`);
//       const body = response.data;

//       setMappings(body.data || []);
//       setPagination({
//         page: body.page || 1,
//         limit,
//         total: body.total || 0,
//         pages: body.pages || 1
//       });
//       setError(null);
//     } catch (err) {
//       const message = showError(err);
//       if (message) setError(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage < 1 || newPage > pagination.pages) return;
//     setPagination((prev) => ({ ...prev, page: newPage }));
//   };

//   const handleLimitChange = (newLimit) => {
//     setPagination((prev) => ({ ...prev, limit: parseInt(newLimit, 10), page: 1 }));
//   };

//   // ---------------------------------------------------------------------
//   // Model / Colour lookups
//   // ---------------------------------------------------------------------
//   const extractList = (body, key) => {
//     if (!body) return [];
//     // API can return: a bare array, { data: [...] }, { data: { models: [...] } },
//     // or { models: [...] } — handle all of these.
//     if (Array.isArray(body)) return body;
//     if (Array.isArray(body?.data?.[key])) return body.data[key];
//     if (Array.isArray(body?.[key])) return body[key];
//     if (Array.isArray(body?.data)) return body.data;
//     return [];
//   };

//   // Fetches the full model list once and caches it (same as InwardStock: we
//   // fetch everything, then filter locally by vehicle type).
//   const loadAllModels = async () => {
//     if (modelsLoaded) return allModels;
//     if (modelsLoadPromise.current) return modelsLoadPromise.current;

//     setModelsLoading(true);
//     const promise = axiosInstance
//       .get('/models')
//       .then((response) => {
//         const list = extractList(response.data, 'models');
//         setAllModels(list);
//         setModelsLoaded(true);
//         return list;
//       })
//       .catch(() => {
//         setAllModels([]);
//         return [];
//       })
//       .finally(() => {
//         setModelsLoading(false);
//         modelsLoadPromise.current = null;
//       });

//     modelsLoadPromise.current = promise;
//     return promise;
//   };

//   // Load the model list once the form modal is open
//   useEffect(() => {
//     if (formModalOpen) {
//       loadAllModels();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [formModalOpen]);

//   // Same filtering logic as InwardStock: only show models matching the
//   // currently selected Vehicle Type (EV / ICE)
//   const filteredModels = allModels.filter((model) => {
//     if (formVehicleType === 'EV') return model.type === 'EV';
//     if (formVehicleType === 'ICE') return model.type === 'ICE';
//     return false;
//   });

//   const modelSelectOptions = filteredModels.map((model) => ({
//     value: model._id || model.id,
//     label: model.model_name || model.name
//   }));

//   const fetchColorsForModel = async (modelId) => {
//     if (!modelId) {
//       setColorOptions([]);
//       return;
//     }
//     try {
//       setColorsLoading(true);
//       const response = await axiosInstance.get(`/colors/model/${modelId}`);
//       const list = extractList(response.data, 'colors');
//       setColorOptions(Array.isArray(list) ? list : []);
//     } catch (err) {
//       setColorOptions([]);
//     } finally {
//       setColorsLoading(false);
//     }
//   };

//   // Loads (and caches) the distinct mis_name values already saved for a given
//   // mapping type, from GET /advance-model-mapping?type=...&limit=1000
//   const loadMisNames = async (type) => {
//     if (misNamesCache[type]) return misNamesCache[type];
//     if (misNamesLoadPromise.current[type]) return misNamesLoadPromise.current[type];

//     setMisNamesLoadingType(type);
//     const promise = axiosInstance
//       .get(`/advance-model-mapping?page=1&limit=1000&type=${type}`)
//       .then((response) => {
//         const rows = response.data?.data || [];
//         const names = Array.from(
//           new Set(rows.map((r) => (r.mis_name || '').trim()).filter(Boolean))
//         ).sort((a, b) => a.localeCompare(b));
//         setMisNamesCache((prev) => ({ ...prev, [type]: names }));
//         return names;
//       })
//       .catch(() => [])
//       .finally(() => {
//         setMisNamesLoadingType((prev) => (prev === type ? null : prev));
//         delete misNamesLoadPromise.current[type];
//       });

//     misNamesLoadPromise.current[type] = promise;
//     return promise;
//   };

//   const filterStrings = (list, query) => {
//     const q = (query || '').trim().toLowerCase();
//     if (!q) return list.slice(0, 20);
//     return list.filter((v) => v.toLowerCase().includes(q)).slice(0, 20);
//   };

//   const searchMisNames = async (type, query, setSuggestions) => {
//     const list = await loadMisNames(type);
//     setSuggestions(filterStrings(list, query));
//   };

//   const handleMisNameInputChange = (value) => {
//     setFormMisName(value);
//     setShowMisSuggestions(true);
//     if (misSearchTimer.current) clearTimeout(misSearchTimer.current);
//     misSearchTimer.current = setTimeout(() => {
//       searchMisNames(formType, value, setMisSuggestions);
//     }, 200);
//   };

//   const handleSelectMisSuggestion = (name) => {
//     setFormMisName(name);
//     setShowMisSuggestions(false);
//     setMisSuggestions([]);
//   };

//   // DMS Vehicle Model field (Type = "model") — react-select scoped by Vehicle Type
//   const handleDmsModelSelect = (selectedOption) => {
//     setFormDmsName(selectedOption ? selectedOption.label : '');
//   };

//   // Model picker used to scope the colour dropdown (Type = "color")
//   const handleColorModelSelect = (selectedOption) => {
//     const modelId = selectedOption ? selectedOption.value : null;
//     setSelectedColorModelId(modelId);
//     setFormDmsName('');
//     if (modelId) {
//       fetchColorsForModel(modelId);
//     } else {
//       setColorOptions([]);
//     }
//   };

//   const resetLookupState = () => {
//     setSelectedColorModelId(null);
//     setColorOptions([]);
//     setColorsLoading(false);
//     setMisSuggestions([]);
//     setShowMisSuggestions(false);
//   };

//   // ---------------------------------------------------------------------
//   // Add / Edit
//   // ---------------------------------------------------------------------
//   const openAddModal = () => {
//     if (!canCreate) {
//       showError('You do not have permission to add mappings');
//       return;
//     }
//     setFormMode('add');
//     setFormType(filterType || 'color');
//     setFormVehicleType(filterVehicleType || 'EV');
//     setFormDmsName('');
//     setFormMisName('');
//     setFormRemarks('');
//     setEditingId(null);
//     setFormError('');
//     resetLookupState();
//     setFormModalOpen(true);
//   };

//   const openEditModal = (mapping) => {
//     if (!canUpdate) {
//       showError('You do not have permission to edit mappings');
//       return;
//     }
//     setFormMode('edit');
//     setFormType(mapping.type);
//     setFormVehicleType(mapping.vehicle_type || 'EV');
//     setFormDmsName(mapping.dms_name);
//     setFormMisName(mapping.mis_name || '');
//     setFormRemarks(mapping.remarks || '');
//     setEditingId(mapping._id);
//     setFormError('');
//     resetLookupState();
//     setFormModalOpen(true);
//   };

//   const resetFormModal = () => {
//     setFormModalOpen(false);
//     setFormError('');
//   };

//   const handleFormTypeChange = (newType) => {
//     setFormType(newType);
//     setFormDmsName('');
//     setFormMisName('');
//     resetLookupState();
//   };

//   // Same as InwardStock: changing Vehicle Type clears the previously
//   // selected model / colour, since the available models depend on it
//   const handleFormVehicleTypeChange = (newVehicleType) => {
//     setFormVehicleType(newVehicleType);
//     setFormDmsName('');
//     resetLookupState();
//   };

//   const handleFormSubmit = async () => {
//     if (!formVehicleType) {
//       setFormError('Vehicle type is required');
//       return;
//     }
//     if (!formDmsName.trim()) {
//       setFormError(formType === 'color' ? 'DMS colour is required' : 'DMS name is required');
//       return;
//     }

//     setFormLoading(true);
//     setFormError('');
//     try {
//       if (formMode === 'add') {
//         await axiosInstance.post('/advance-model-mapping', {
//           type: formType,
//           vehicle_type: formVehicleType,
//           dms_name: formDmsName.trim(),
//           mis_name: formMisName.trim() || undefined,
//           remarks: formRemarks.trim() || undefined
//         });
//         showSuccess('Mapping added successfully!');
//       } else {
//         await axiosInstance.put(`/advance-model-mapping/${editingId}`, {
//           type: formType,
//           vehicle_type: formVehicleType,
//           dms_name: formDmsName.trim(),
//           mis_name: formMisName.trim() || null,
//           remarks: formRemarks.trim() || null
//         });
//         showSuccess('Mapping updated successfully!');
//       }
//       resetFormModal();
//       fetchData();
//     } catch (err) {
//       const message = err.response?.data?.message || 'Failed to save mapping';
//       setFormError(message);
//       showError(message);
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   // ---------------------------------------------------------------------
//   // Delete
//   // ---------------------------------------------------------------------
//   const handleDelete = async (id) => {
//     if (!canDelete) {
//       showError('You do not have permission to delete mappings');
//       return;
//     }
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/advance-model-mapping/${id}`);
//         showSuccess('Mapping deactivated successfully!');
//         fetchData();
//       } catch (err) {
//         showError(err.response?.data?.message || 'Failed to delete mapping');
//       }
//     }
//   };

//   // ---------------------------------------------------------------------
//   // Export
//   // ---------------------------------------------------------------------
//   const handleExport = async () => {
//     setExportLoading(true);
//     try {
//       const params = new URLSearchParams();
//       params.append('type', exportType);
//       if (exportVehicleType) params.append('vehicle_type', exportVehicleType);

//       const response = await axiosInstance.get(
//         `/advance-model-mapping/export?${params.toString()}`,
//         { responseType: 'blob' }
//       );

//       const blob = new Blob([response.data], {
//         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//       });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute(
//         'download',
//         `Advance_Model_Mapping_${exportType}_${new Date().toLocaleDateString()}.xlsx`
//       );
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);

//       setExportModalOpen(false);
//       showSuccess('Excel exported successfully!');
//     } catch (err) {
//       console.error('Export failed:', err);
//       showError('Failed to export Excel');
//     } finally {
//       setExportLoading(false);
//     }
//   };

//   // ---------------------------------------------------------------------
//   // Import
//   // ---------------------------------------------------------------------
//   const handleImportFileChange = (e) => {
//     setImportFile(e.target.files[0]);
//   };

//   const resetImportModal = () => {
//     setImportModalOpen(false);
//     setImportFile(null);
//     setImportResult(null);
//   };

//   const handleImport = async () => {
//     if (!importFile) {
//       showError('Please select a file');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', importFile);
//     formData.append('type', importType);

//     setImportLoading(true);
//     setImportResult(null);
//     try {
//       const response = await axiosInstance.post('/advance-model-mapping/import', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
//       setImportResult(response.data);
//       showSuccess(response.data.message || 'Import completed');
//       fetchData();
//     } catch (err) {
//       const message = err.response?.data?.message || 'Failed to import file';
//       showError(message);
//       setImportResult(err.response?.data || null);
//     } finally {
//       setImportLoading(false);
//     }
//   };

//   if (loading && mappings.length === 0) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" />
//       </div>
//     );
//   }

//   if (!canView) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Advance Model Mapping.
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="alert alert-danger" role="alert">
//         {error}
//       </div>
//     );
//   }

//   const startRecord = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
//   const endRecord = Math.min(pagination.page * pagination.limit, pagination.total);

//   let startPage = Math.max(1, pagination.page - 2);
//   let endPage = Math.min(pagination.pages, pagination.page + 2);
//   if (pagination.page <= 3) endPage = Math.min(5, pagination.pages);
//   if (pagination.page >= pagination.pages - 2) startPage = Math.max(1, pagination.pages - 4);
//   const displayedPages = [];
//   for (let i = startPage; i <= endPage; i++) displayedPages.push(i);

//   // Currently selected option objects for the react-select controls
//   const dmsModelSelectedOption = formDmsName
//     ? modelSelectOptions.find((opt) => opt.label === formDmsName) || { value: formDmsName, label: formDmsName }
//     : null;

//   const colorModelSelectedOption = selectedColorModelId
//     ? modelSelectOptions.find((opt) => opt.value === selectedColorModelId) || null
//     : null;

//   return (
//     <div>
//       <style>{`
//         .advance-mapping-tabs .nav-link {
//           color: #6b7280;
//           font-weight: 500;
//           border-bottom: 2px solid transparent;
//           padding: 8px 16px;
//         }
//         .advance-mapping-tabs .nav-link.active {
//           color: #2563eb;
//           font-weight: 600;
//           border-bottom: 2px solid #2563eb;
//           background: transparent;
//         }
//         .advance-mapping-tabs .nav-link:hover {
//           color: #2563eb;
//         }

//         .pill-action-btn {
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           border-radius: 6px;
//           padding: 5px 12px;
//           font-size: 13px;
//           font-weight: 500;
//           border: none;
//           line-height: 1.4;
//         }
//         .pill-action-btn svg,
//         .pill-action-btn .c-icon,
//         .pill-action-btn .icon {
//           width: 15px;
//           height: 15px;
//         }
//         .pill-action-btn-primary {
//           background-color: #2563eb;
//           color: #fff;
//         }
//         .pill-action-btn-primary:hover {
//           background-color: #1d4ed8;
//           color: #fff;
//         }
//         .pill-action-btn-outline {
//           background-color: #fff;
//           color: #374151;
//           border: 1px solid #d1d5db;
//         }
//         .pill-action-btn-outline:hover {
//           background-color: #f3f4f6;
//           color: #374151;
//         }

//         .options-dropdown-btn {
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           gap: 6px;
//           border-radius: 6px;
//           padding: 5px 12px;
//           font-size: 13px;
//           font-weight: 500;
//           background-color: #fff;
//           color: #374151;
//           border: 1px solid #d1d5db;
//         }
//         .options-dropdown-btn:hover,
//         .options-dropdown-btn:focus,
//         .options-dropdown-btn:active {
//           background-color: #f3f4f6 !important;
//           color: #374151 !important;
//           border-color: #d1d5db !important;
//         }
//         .options-dropdown-btn::after {
//           display: none;
//         }
//         .options-dropdown-menu .dropdown-item {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           font-size: 13px;
//           padding: 8px 14px;
//         }
//         .options-dropdown-menu .dropdown-item.text-danger:hover {
//           background-color: #fef2f2;
//         }

//         .autocomplete-field-wrap {
//           position: relative;
//         }
//         .autocomplete-suggestions {
//           position: absolute;
//           top: 100%;
//           left: 0;
//           right: 0;
//           z-index: 1060;
//           background: #fff;
//           border: 1px solid #d1d5db;
//           border-top: none;
//           border-radius: 0 0 6px 6px;
//           max-height: 220px;
//           overflow-y: auto;
//           box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
//         }
//         .autocomplete-suggestion-item {
//           padding: 8px 12px;
//           font-size: 14px;
//           cursor: pointer;
//         }
//         .autocomplete-suggestion-item:hover {
//           background-color: #f3f4f6;
//         }
//         .autocomplete-suggestion-item.disabled {
//           cursor: default;
//           color: #9ca3af;
//         }
//         .autocomplete-suggestion-item.disabled:hover {
//           background-color: transparent;
//         }
//       `}</style>
//       <div className="title">Advance Model Mapping</div>

//       <CCard className="table-container mt-4">
//         <CCardHeader className="card-header d-flex justify-content-between align-items-center">
//           <div>
//             {canCreate && (
//               <CButton size="sm" className="action-btn me-1" onClick={openAddModal}>
//                 <CIcon icon={cilPlus} className="icon" /> New Mapping
//               </CButton>
//             )}

//             <CButton
//               size="sm"
//               className="action-btn me-1"
//               onClick={() => setExportModalOpen(true)}
//             >
//               <CIcon icon={cilCloudDownload} className="icon" /> Export Excel
//             </CButton>

//             {canCreate && (
//               <CButton
//                 size="sm"
//                 className="action-btn me-1"
//                 onClick={() => setImportModalOpen(true)}
//               >
//                 <CIcon icon={cilCloudUpload} className="icon" /> Import Excel
//               </CButton>
//             )}
//           </div>
//         </CCardHeader>

//         <CCardBody>
//           <CNav variant="underline" className="mb-3 advance-mapping-tabs">
//             <CNavItem>
//               <CNavLink
//                 active={filterType === 'color'}
//                 onClick={() => {
//                   setFilterType('color');
//                   setPagination((prev) => ({ ...prev, page: 1 }));
//                 }}
//                 style={{ cursor: 'pointer' }}
//               >
//                 Colour
//               </CNavLink>
//             </CNavItem>
//             <CNavItem>
//               <CNavLink
//                 active={filterType === 'model'}
//                 onClick={() => {
//                   setFilterType('model');
//                   setPagination((prev) => ({ ...prev, page: 1 }));
//                 }}
//                 style={{ cursor: 'pointer' }}
//               >
//                 Model
//               </CNavLink>
//             </CNavItem>
//           </CNav>

//           <div className="d-flex justify-content-between mb-3 align-items-center flex-wrap gap-2">
//             <div className="d-flex align-items-center">
//               <CFormLabel className="mb-0 me-2">Rows per page:</CFormLabel>
//               <CFormSelect
//                 value={pagination.limit}
//                 onChange={(e) => handleLimitChange(e.target.value)}
//                 style={{ width: '80px' }}
//                 size="sm"
//               >
//                 {PAGE_SIZE_OPTIONS.map((option) => (
//                   <option key={option} value={option}>
//                     {option}
//                   </option>
//                 ))}
//               </CFormSelect>

//               <CFormLabel className="mb-0 ms-3 me-2">Vehicle Type:</CFormLabel>
//               <CFormSelect
//                 value={filterVehicleType}
//                 onChange={(e) => {
//                   setFilterVehicleType(e.target.value);
//                   setPagination((prev) => ({ ...prev, page: 1 }));
//                 }}
//                 style={{ width: '110px' }}
//                 size="sm"
//               >
//                 <option value="">All</option>
//                 <option value="EV">EV</option>
//                 <option value="ICE">ICE</option>
//               </CFormSelect>
//             </div>

//             <div className="d-flex align-items-center">
//               <CFormLabel className="mt-1 m-1">Search:</CFormLabel>
//               <CFormInput
//                 type="text"
//                 className="d-inline-block square-search"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search by DMS or MIS name..."
//                 style={{ width: '250px' }}
//               />
//             </div>
//           </div>

//           {loading && (
//             <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
//               <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
//             </div>
//           )}

//           <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
//             <CTable striped bordered hover className="responsive-table">
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Type</CTableHeaderCell>
//                   <CTableHeaderCell>Vehicle Type</CTableHeaderCell>
//                   <CTableHeaderCell>DMS Name</CTableHeaderCell>
//                   <CTableHeaderCell>MIS Name</CTableHeaderCell>
//                   <CTableHeaderCell>Remarks</CTableHeaderCell>
//                   <CTableHeaderCell>Status</CTableHeaderCell>
//                   {(canUpdate || canDelete) && <CTableHeaderCell>Action</CTableHeaderCell>}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {mappings.length === 0 && !loading ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan={(canUpdate || canDelete) ? '8' : '7'} className="text-center">
//                       {searchTerm ? `No results found for "${searchTerm}"` : 'No mappings available'}
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   mappings.map((mapping, index) => {
//                     const globalIndex = (pagination.page - 1) * pagination.limit + index + 1;
//                     return (
//                       <CTableRow key={mapping._id}>
//                         <CTableDataCell>{globalIndex}</CTableDataCell>
//                         <CTableDataCell>
//                           <CBadge color={mapping.type === 'color' ? 'info' : 'primary'}>
//                             {mapping.type === 'color' ? 'Colour' : 'Model'}
//                           </CBadge>
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {mapping.vehicle_type ? (
//                             <CBadge color={mapping.vehicle_type === 'EV' ? 'success' : 'warning'}>
//                               {mapping.vehicle_type}
//                             </CBadge>
//                           ) : (
//                             '—'
//                           )}
//                         </CTableDataCell>
//                         <CTableDataCell>{mapping.dms_name}</CTableDataCell>
//                         <CTableDataCell>{mapping.mis_name || '—'}</CTableDataCell>
//                         <CTableDataCell>{mapping.remarks || '—'}</CTableDataCell>
//                         <CTableDataCell>
//                           <CBadge color={mapping.status === 'active' ? 'success' : 'secondary'}>
//                             {mapping.status}
//                           </CBadge>
//                         </CTableDataCell>
//                         {(canUpdate || canDelete) && (
//                           <CTableDataCell>
//                             <CDropdown alignment="end">
//                               <CDropdownToggle
//                                 size="sm"
//                                 className="options-dropdown-btn"
//                                 caret={false}
//                               >
//                                 <CIcon icon={cilSettings} />
//                                 Options
//                               </CDropdownToggle>
//                               <CDropdownMenu className="options-dropdown-menu">
//                                 {canUpdate && (
//                                   <CDropdownItem
//                                     style={{ cursor: 'pointer' }}
//                                     onClick={() => openEditModal(mapping)}
//                                   >
//                                     <CIcon icon={cilPencil} />
//                                     Edit
//                                   </CDropdownItem>
//                                 )}
//                                 {canDelete && (
//                                   <CDropdownItem
//                                     className="text-danger"
//                                     style={{ cursor: 'pointer' }}
//                                     onClick={() => handleDelete(mapping._id)}
//                                   >
//                                     <CIcon icon={cilTrash} />
//                                     Delete
//                                   </CDropdownItem>
//                                 )}
//                               </CDropdownMenu>
//                             </CDropdown>
//                           </CTableDataCell>
//                         )}
//                       </CTableRow>
//                     );
//                   })
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>

//           {pagination.total > 0 && (
//             <div className="mt-4">
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <span className="text-muted" style={{ fontSize: '13px' }}>
//                   {loading ? 'Loading…' : `Showing ${startRecord}–${endRecord} of ${pagination.total} records`}
//                 </span>
//               </div>

//               {pagination.pages > 1 && (
//                 <CPagination align="center" aria-label="Page navigation">
//                   <CPaginationItem
//                     aria-label="Previous"
//                     onClick={() => handlePageChange(pagination.page - 1)}
//                     disabled={pagination.page === 1 || loading}
//                   >
//                     <CIcon icon={cilChevronLeft} />
//                   </CPaginationItem>

//                   {displayedPages.map((page) => (
//                     <CPaginationItem
//                       key={page}
//                       onClick={() => handlePageChange(page)}
//                       active={pagination.page === page}
//                       disabled={loading}
//                     >
//                       {page}
//                     </CPaginationItem>
//                   ))}

//                   <CPaginationItem
//                     aria-label="Next"
//                     onClick={() => handlePageChange(pagination.page + 1)}
//                     disabled={pagination.page === pagination.pages || loading}
//                   >
//                     <CIcon icon={cilChevronRight} />
//                   </CPaginationItem>
//                 </CPagination>
//               )}
//             </div>
//           )}
//         </CCardBody>
//       </CCard>

//       {/* Add / Edit Modal */}
//       <CModal visible={formModalOpen} onClose={resetFormModal}>
//         <CModalHeader>
//           <CModalTitle>{formMode === 'add' ? 'Add Mapping' : 'Edit Mapping'}</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {formError && <CAlert color="danger">{formError}</CAlert>}

//           <div className="mb-3">
//             <CFormLabel>Type<span className="required">*</span></CFormLabel>
//             <CFormSelect
//               value={formType}
//               onChange={(e) => handleFormTypeChange(e.target.value)}
//               disabled={formMode === 'edit'}
//             >
//               <option value="color">Colour</option>
//               <option value="model">Model</option>
//             </CFormSelect>
//           </div>

//           <div className="mb-3">
//             <CFormLabel>Vehicle Type<span className="required">*</span></CFormLabel>
//             <CFormSelect
//               value={formVehicleType}
//               onChange={(e) => handleFormVehicleTypeChange(e.target.value)}
//             >
//               <option value="EV">EV</option>
//               <option value="ICE">ICE</option>
//             </CFormSelect>
//           </div>

//           {formType === 'model' ? (
//             // ------------------------------------------------------------
//             // Type = Model -> DMS field is a react-select filtered by
//             // Vehicle Type (EV / ICE), same as InwardStock
//             // ------------------------------------------------------------
//             <div className="mb-3">
//               <CFormLabel>
//                 DMS Vehicle Model<span className="required">*</span>
//               </CFormLabel>
//               <Select
//                 classNamePrefix="react-select"
//                 placeholder={modelsLoading ? 'Loading models…' : '- Select a Model -'}
//                 isLoading={modelsLoading}
//                 isClearable
//                 options={modelSelectOptions}
//                 value={dmsModelSelectedOption}
//                 onChange={handleDmsModelSelect}
//               />
//             </div>
//           ) : (
//             // ------------------------------------------------------------
//             // Type = Colour -> pick a Model (filtered by Vehicle Type) first,
//             // then colours for that model load from /colors/model/{id}
//             // ------------------------------------------------------------
//             <>
//               <div className="mb-3">
//                 <CFormLabel>
//                   Model<span className="required">*</span>
//                 </CFormLabel>
//                 <Select
//                   classNamePrefix="react-select"
//                   placeholder={modelsLoading ? 'Loading models…' : '- Select a Model -'}
//                   isLoading={modelsLoading}
//                   isClearable
//                   options={modelSelectOptions}
//                   value={colorModelSelectedOption}
//                   onChange={handleColorModelSelect}
//                 />
//               </div>

//               <div className="mb-3">
//                 <CFormLabel>
//                   DMS Vehicle Colour<span className="required">*</span>
//                 </CFormLabel>
//                 <CFormSelect
//                   value={formDmsName}
//                   onChange={(e) => setFormDmsName(e.target.value)}
//                   disabled={colorsLoading}
//                 >
//                   <option value="">{colorsLoading ? 'Loading colours…' : '-Select a colour-'}</option>
//                   {/* Keep the currently-set value selectable even before a model is (re)picked, e.g. when editing */}
//                   {formDmsName && !colorOptions.some((c) => c.name === formDmsName) && (
//                     <option value={formDmsName}>{formDmsName}</option>
//                   )}
//                   {colorOptions.map((color) => (
//                     <option key={color.id || color._id} value={color.name}>
//                       {color.name}
//                     </option>
//                   ))}
//                 </CFormSelect>
//                 {!selectedColorModelId && !formDmsName && (
//                   <small className="text-muted">Select a model above to load its colours.</small>
//                 )}
//               </div>
//             </>
//           )}

//           <div className="mb-3 autocomplete-field-wrap">
//             <CFormLabel>
//               {formType === 'color' ? 'MIS Vehicle Colour' : 'MIS Vehicle Model'}
//             </CFormLabel>
//             <CFormInput
//               value={formMisName}
//               onChange={(e) => handleMisNameInputChange(e.target.value)}
//               onFocus={() => {
//                 setShowMisSuggestions(true);
//                 searchMisNames(formType, formMisName, setMisSuggestions);
//               }}
//               onBlur={() => setTimeout(() => setShowMisSuggestions(false), 150)}
//               placeholder={formType === 'color' ? 'e.g. WHITE PEARL' : 'e.g. ACTIVA-6G'}
//               autoComplete="off"
//             />
//             {showMisSuggestions && (
//               <div className="autocomplete-suggestions">
//                 {misNamesLoadingType === formType ? (
//                   <div className="autocomplete-suggestion-item disabled">Loading…</div>
//                 ) : misSuggestions.length > 0 ? (
//                   misSuggestions.map((name) => (
//                     <div
//                       key={name}
//                       className="autocomplete-suggestion-item"
//                       onMouseDown={() => handleSelectMisSuggestion(name)}
//                     >
//                       {name}
//                     </div>
//                   ))
//                 ) : (
//                   <div className="autocomplete-suggestion-item disabled">
//                     No previously used values found
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           <div className="mb-3">
//             <CFormLabel>Remarks</CFormLabel>
//             <CFormTextarea
//               value={formRemarks}
//               onChange={(e) => setFormRemarks(e.target.value)}
//               rows={2}
//             />
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={resetFormModal} disabled={formLoading}>
//             Cancel
//           </CButton>
//           <CButton className="submit-button" onClick={handleFormSubmit} disabled={formLoading}>
//             {formLoading ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 Saving...
//               </>
//             ) : (
//               'Save'
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Export Modal */}
//       <CModal visible={exportModalOpen} onClose={() => setExportModalOpen(false)}>
//         <CModalHeader>
//           <CModalTitle>Export Excel</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <CFormLabel>Type:</CFormLabel>
//             <CFormSelect value={exportType} onChange={(e) => setExportType(e.target.value)}>
//               <option value="color">Colour</option>
//               <option value="model">Model</option>
//             </CFormSelect>
//           </div>

//           <div className="mb-3">
//             <CFormLabel>Vehicle Type:</CFormLabel>
//             <CFormSelect
//               value={exportVehicleType}
//               onChange={(e) => setExportVehicleType(e.target.value)}
//             >
//               <option value="">All</option>
//               <option value="EV">EV</option>
//               <option value="ICE">ICE</option>
//             </CFormSelect>
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton className="submit-button" onClick={handleExport} disabled={exportLoading}>
//             {exportLoading ? 'Exporting...' : 'Export'}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Import Modal */}
//       <CModal visible={importModalOpen} onClose={resetImportModal}>
//         <CModalHeader>
//           <CModalTitle>Import Excel</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <CFormLabel>Type:</CFormLabel>
//             <CFormSelect value={importType} onChange={(e) => setImportType(e.target.value)}>
//               <option value="color">Colour</option>
//               <option value="model">Model</option>
//             </CFormSelect>
//           </div>

//           <div className="mb-3">
//             <CFormLabel>Select Excel/CSV File:</CFormLabel>
//             <CFormInput
//               type="file"
//               id="advance-mapping-import-file"
//               accept=".xlsx,.xls,.csv"
//               onChange={handleImportFileChange}
//             />
//             <small className="text-muted">Supported formats: .xlsx, .xls, .csv</small>
//           </div>

//           {importFile && (
//             <CAlert color="info">
//               Selected file: {importFile.name} ({(importFile.size / 1024).toFixed(2)} KB)
//             </CAlert>
//           )}

//           {importResult && (
//             <CAlert color={importResult.status === 'success' ? 'success' : 'warning'}>
//               <div className="d-flex align-items-center mb-2">
//                 <CIcon
//                   icon={importResult.status === 'success' ? cilCheckCircle : cilWarning}
//                   className="me-2"
//                 />
//                 {importResult.message}
//               </div>
//               {importResult.summary && (
//                 <ul className="mb-0">
//                   <li>Total rows: {importResult.summary.totalRows}</li>
//                   <li>Created: {importResult.summary.created}</li>
//                   <li>Updated: {importResult.summary.updated}</li>
//                   <li>Skipped: {importResult.summary.skipped}</li>
//                 </ul>
//               )}
//             </CAlert>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={resetImportModal} disabled={importLoading}>
//             Close
//           </CButton>
//           <CButton
//             className="submit-button"
//             onClick={handleImport}
//             disabled={!importFile || importLoading}
//           >
//             {importLoading ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 Importing...
//               </>
//             ) : (
//               'Import'
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </div>
//   );
// };

// export default AdvantageModelMapping;
//----------------------------------------------------------------

// import '../../css/table.css';
// import '../../css/form.css';
// import {
//   React,
//   useState,
//   useEffect,
//   getDefaultSearchFields,
//   useTableFilter,
//   confirmDelete,
//   showError,
//   showSuccess,
//   axiosInstance
// } from '../../utils/tableImports';
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
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CFormSelect,
//   CFormTextarea,
//   CAlert,
//   CPagination,
//   CPaginationItem,
//   CNav,
//   CNavItem,
//   CNavLink,
//   CDropdown,
//   CDropdownToggle,
//   CDropdownMenu,
//   CDropdownItem
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import {
//   cilPlus,
//   cilSearch,
//   cilSettings,
//   cilPencil,
//   cilTrash,
//   cilCloudDownload,
//   cilCloudUpload,
//   cilCheckCircle,
//   cilWarning,
//   cilChevronLeft,
//   cilChevronRight
// } from '@coreui/icons';
// import { useNavigate } from 'react-router-dom';
// import { useRef } from 'react';
// import Select from 'react-select';

// const PAGE_SIZE_OPTIONS = [25, 50, 100];
// const DEFAULT_LIMIT = 25;

// const AdvantageModelMapping = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Server-side state
//   const [mappings, setMappings] = useState([]);
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: DEFAULT_LIMIT,
//     total: 0,
//     pages: 1
//   });

//   // Search / filter state
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterType, setFilterType] = useState('color');
//   const [filterVehicleType, setFilterVehicleType] = useState('');
//   const searchTimer = useRef(null);

//   // Add/Edit modal state
//   const [formModalOpen, setFormModalOpen] = useState(false);
//   const [formMode, setFormMode] = useState('add');
//   const [formType, setFormType] = useState('color');
//   const [formVehicleType, setFormVehicleType] = useState('EV');
//   const [formDmsName, setFormDmsName] = useState('');
//   const [formMisName, setFormMisName] = useState('');
//   const [formRemarks, setFormRemarks] = useState('');
//   const [editingId, setEditingId] = useState(null);
//   const [formLoading, setFormLoading] = useState(false);
//   const [formError, setFormError] = useState('');

//   // ---- MIS Models (from /models API) ----
//   const [misModels, setMisModels] = useState([]);
//   const [misModelsLoading, setMisModelsLoading] = useState(false);

//   // ---- DMS Models (from /advantage-approval/pending API) ----
//   const [dmsModels, setDmsModels] = useState([]);
//   const [dmsModelsLoading, setDmsModelsLoading] = useState(false);
//   const [dmsModelsError, setDmsModelsError] = useState('');

//   // ---- MIS name suggestions, sourced from previously saved mis_name values ----
//   const [misNamesCache, setMisNamesCache] = useState({});
//   const [misNamesLoadingType, setMisNamesLoadingType] = useState(null);
//   const misNamesLoadPromise = useRef({});
//   const [misSuggestions, setMisSuggestions] = useState([]);
//   const [showMisSuggestions, setShowMisSuggestions] = useState(false);
//   const misSearchTimer = useRef(null);

//   // Export modal state
//   const [exportModalOpen, setExportModalOpen] = useState(false);
//   const [exportType, setExportType] = useState('color');
//   const [exportVehicleType, setExportVehicleType] = useState('');
//   const [exportLoading, setExportLoading] = useState(false);

//   // Import modal state
//   const [importModalOpen, setImportModalOpen] = useState(false);
//   const [importType, setImportType] = useState('color');
//   const [importFile, setImportFile] = useState(null);
//   const [importLoading, setImportLoading] = useState(false);
//   const [importResult, setImportResult] = useState(null);

//   const { permissions = [] } = useTableFilter ? { permissions: [] } : { permissions: [] };
//   const navigate = useNavigate();

//   const canView = true;
//   const canCreate = true;
//   const canUpdate = true;
//   const canDelete = true;

//   useEffect(() => {
//     fetchData();
//   }, [pagination.page, pagination.limit, filterType, filterVehicleType]);

//   useEffect(() => {
//     if (searchTimer.current) clearTimeout(searchTimer.current);
//     searchTimer.current = setTimeout(() => {
//       setPagination((prev) => ({ ...prev, page: 1 }));
//       fetchData(1, pagination.limit, searchTerm);
//     }, 500);
//     return () => {
//       if (searchTimer.current) clearTimeout(searchTimer.current);
//     };
//   }, [searchTerm]);

//   const fetchData = async (page = pagination.page, limit = pagination.limit, search = searchTerm) => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams();
//       params.append('page', page);
//       params.append('limit', limit);
//       if (search && search.trim()) params.append('search', search.trim());
//       if (filterType) params.append('type', filterType);
//       if (filterVehicleType) params.append('vehicle_type', filterVehicleType);

//       const response = await axiosInstance.get(`/advance-model-mapping?${params.toString()}`);
//       const body = response.data;

//       setMappings(body.data || []);
//       setPagination({
//         page: body.page || 1,
//         limit,
//         total: body.total || 0,
//         pages: body.pages || 1
//       });
//       setError(null);
//     } catch (err) {
//       const message = showError(err);
//       if (message) setError(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage < 1 || newPage > pagination.pages) return;
//     setPagination((prev) => ({ ...prev, page: newPage }));
//   };

//   const handleLimitChange = (newLimit) => {
//     setPagination((prev) => ({ ...prev, limit: parseInt(newLimit, 10), page: 1 }));
//   };

//   // ---------------------------------------------------------------------
//   // Generic helper to dig an array out of an API response, no matter how
//   // deeply/inconsistently it's nested. Tries a list of common shapes.
//   // ---------------------------------------------------------------------
//   const extractArrayFromResponse = (body) => {
//     if (!body) return [];
//     if (Array.isArray(body)) return body;

//     const candidates = [
//       body.data?.vehicles, // actual shape returned by /advantage-approval/pending
//       body.data,
//       body.data?.data,
//       body.data?.records,
//       body.data?.data?.records,
//       body.data?.results,
//       body.data?.items,
//       body.records,
//       body.results,
//       body.items
//     ];

//     for (const candidate of candidates) {
//       if (Array.isArray(candidate)) return candidate;
//     }

//     return [];
//   };

//   const extractList = (body, key) => {
//     if (!body) return [];
//     if (Array.isArray(body)) return body;
//     if (Array.isArray(body?.data?.[key])) return body.data[key];
//     if (Array.isArray(body?.[key])) return body[key];
//     if (Array.isArray(body?.data)) return body.data;
//     return [];
//   };

//   // ---------------------------------------------------------------------
//   // Fetch MIS Models (from /models API)
//   // ---------------------------------------------------------------------
//   const fetchMisModels = async (vehicleType) => {
//     if (!vehicleType) return [];

//     setMisModelsLoading(true);
//     try {
//       const response = await axiosInstance.get('/models');
//       const list = extractList(response.data, 'models');

//       // Filter by vehicle type
//       const filtered = list.filter((item) => {
//         if (vehicleType === 'EV') return item.type === 'EV';
//         if (vehicleType === 'ICE') return item.type === 'ICE';
//         return false;
//       });

//       setMisModels(filtered);
//       return filtered;
//     } catch (error) {
//       console.error('Error loading MIS models:', error);
//       setMisModels([]);
//       return [];
//     } finally {
//       setMisModelsLoading(false);
//     }
//   };

//   // ---------------------------------------------------------------------
//   // Fetch DMS Models (from /advantage-approval/pending API)
//   // ---------------------------------------------------------------------
//   const fetchDmsModels = async (vehicleType) => {
//     if (!vehicleType) return [];

//     setDmsModelsLoading(true);
//     setDmsModelsError('');
//     try {
//       const response = await axiosInstance.get('/advantage-approval/pending', {
//         params: {
//           page: 1,
//           limit: 100 // Fetch a reasonable number of records
//         }
//       });

//       // Debug aid — check your browser console to see the real shape of
//       // this payload if the dropdown ever comes back empty unexpectedly.
//       // console.log('DMS pending raw response:', response.data);

//       const list = extractArrayFromResponse(response.data);

//       // Filter by vehicle type if the data contains type information.
//       // The /advantage-approval/pending payload doesn't expose an
//       // EV/ICE field directly (only stockData.vehicleCategory, e.g.
//       // "Scooter"), so most records won't have a matching field — those
//       // are included by default rather than silently dropped.
//       const normalize = (val) => (val || '').toString().trim().toUpperCase();
//       const targetType = normalize(vehicleType);

//       const filtered = list.filter((item) => {
//         const itemType = normalize(
//           item.type ||
//             item.vehicleType ||
//             item.vehicle_type ||
//             item.vehicle?.type ||
//             item.stockData?.vehicleType ||
//             item.stockData?.type
//         );
//         if (!itemType) return true; // No type field present — include it
//         return itemType === targetType;
//       });

//       // Real shape (per the pending API): each record is a stock entry
//       // like { stockData: { vehicleModel, ... }, dmsToMisMapping: { model:
//       // { dms, mapped, isMapped }, color: {...} } } — there is no flat
//       // dms_name field. Prefer the explicit DMS mapping name, fall back
//       // to the raw stock model name, and dedupe since many stock rows
//       // share the same model.
//       const seen = new Set();
//       const withIds = [];
//       filtered.forEach((item, idx) => {
//         const dmsName = (
//           item.dmsToMisMapping?.model?.dms ||
//           item.stockData?.vehicleModel ||
//           item.dms_name ||
//           item.name ||
//           item.model_name ||
//           ''
//         ).trim();

//         if (!dmsName || seen.has(dmsName)) return;
//         seen.add(dmsName);

//         withIds.push({
//           ...item,
//           _id: item.stockData?.chassisNumber || item.id || item._id || `dms-${idx}-${dmsName}`,
//           name: dmsName,
//           dms_name: dmsName
//         });
//       });

//       setDmsModels(withIds);

//       if (withIds.length === 0) {
//         setDmsModelsError(
//           list.length === 0
//             ? 'No pending DMS models were returned by the API.'
//             : `No pending DMS models found for vehicle type "${vehicleType}".`
//         );
//       }

//       return withIds;
//     } catch (error) {
//       console.error('Error loading DMS models:', error);
//       if (error.response?.status === 401) {
//         showError('Authentication required to fetch DMS models. Please login again.');
//         setDmsModelsError('Authentication required. Please log in again.');
//       } else {
//         showError('Failed to fetch DMS models. Please try again later.');
//         setDmsModelsError('Failed to fetch DMS models. Please try again later.');
//       }
//       setDmsModels([]);
//       return [];
//     } finally {
//       setDmsModelsLoading(false);
//     }
//   };

//   // Load models when form modal opens or vehicle type changes
//   useEffect(() => {
//     if (formModalOpen && formVehicleType) {
//       // For Model type, fetch both MIS and DMS models
//       if (formType === 'model') {
//         fetchMisModels(formVehicleType);
//         fetchDmsModels(formVehicleType);
//       } else if (formType === 'color') {
//         // For Color type, we don't need models
//         setMisModels([]);
//         setDmsModels([]);
//         setDmsModelsError('');
//       }
//     }
//   }, [formModalOpen, formType, formVehicleType]);

//   // MIS Model options
//   const misModelOptions = misModels.map((item) => ({
//     value: item._id || item.id,
//     label: item.model_name || item.name || ''
//   }));

//   // DMS Model options
//   const dmsModelOptions = dmsModels.map((item) => ({
//     value: item._id || item.id,
//     label: item.dms_name || item.name || item.model_name || ''
//   }));

//   // Selected MIS model
//   const [selectedMisModelId, setSelectedMisModelId] = useState(null);
//   const selectedMisOption = selectedMisModelId
//     ? misModelOptions.find((opt) => opt.value === selectedMisModelId) || null
//     : null;

//   // Selected DMS model
//   const [selectedDmsModelId, setSelectedDmsModelId] = useState(null);
//   const selectedDmsOption = selectedDmsModelId
//     ? dmsModelOptions.find((opt) => opt.value === selectedDmsModelId) || null
//     : null;

//   // Handle MIS model selection
//   const handleMisModelSelect = (selectedOption) => {
//     const id = selectedOption ? selectedOption.value : null;
//     setSelectedMisModelId(id);

//     const selectedItem = misModels.find((item) => (item._id || item.id) === id);
//     if (selectedOption && selectedItem) {
//       const modelName = selectedItem.model_name || selectedItem.name || '';
//       setFormMisName(modelName);
//     } else {
//       setFormMisName('');
//     }
//   };

//   // Handle DMS model selection
//   const handleDmsModelSelect = (selectedOption) => {
//     const id = selectedOption ? selectedOption.value : null;
//     setSelectedDmsModelId(id);

//     const selectedItem = dmsModels.find((item) => (item._id || item.id) === id);
//     if (selectedOption && selectedItem) {
//       // Use dms_name field from the API response
//       const dmsName = selectedItem.dms_name || selectedItem.name || selectedItem.model_name || '';
//       setFormDmsName(dmsName);
//     } else {
//       setFormDmsName('');
//     }
//   };

//   // Loads (and caches) the distinct mis_name values already saved for a given
//   // mapping type, from GET /advance-model-mapping?type=...&limit=1000
//   const loadMisNames = async (type) => {
//     if (misNamesCache[type]) return misNamesCache[type];
//     if (misNamesLoadPromise.current[type]) return misNamesLoadPromise.current[type];

//     setMisNamesLoadingType(type);
//     const promise = axiosInstance
//       .get(`/advance-model-mapping?page=1&limit=1000&type=${type}`)
//       .then((response) => {
//         const rows = response.data?.data || [];
//         const names = Array.from(
//           new Set(rows.map((r) => (r.mis_name || '').trim()).filter(Boolean))
//         ).sort((a, b) => a.localeCompare(b));
//         setMisNamesCache((prev) => ({ ...prev, [type]: names }));
//         return names;
//       })
//       .catch(() => [])
//       .finally(() => {
//         setMisNamesLoadingType((prev) => (prev === type ? null : prev));
//         delete misNamesLoadPromise.current[type];
//       });

//     misNamesLoadPromise.current[type] = promise;
//     return promise;
//   };

//   const filterStrings = (list, query) => {
//     const q = (query || '').trim().toLowerCase();
//     if (!q) return list.slice(0, 20);
//     return list.filter((v) => v.toLowerCase().includes(q)).slice(0, 20);
//   };

//   const searchMisNames = async (type, query, setSuggestions) => {
//     const list = await loadMisNames(type);
//     setSuggestions(filterStrings(list, query));
//   };

//   const handleMisNameInputChange = (value) => {
//     setFormMisName(value);
//     setShowMisSuggestions(true);
//     if (misSearchTimer.current) clearTimeout(misSearchTimer.current);
//     misSearchTimer.current = setTimeout(() => {
//       searchMisNames(formType, value, setMisSuggestions);
//     }, 200);
//   };

//   const handleSelectMisSuggestion = (name) => {
//     setFormMisName(name);
//     setShowMisSuggestions(false);
//     setMisSuggestions([]);
//   };

//   const resetLookupState = () => {
//     setSelectedMisModelId(null);
//     setSelectedDmsModelId(null);
//     setMisSuggestions([]);
//     setShowMisSuggestions(false);
//   };

//   // ---------------------------------------------------------------------
//   // Add / Edit
//   // ---------------------------------------------------------------------
//   const openAddModal = () => {
//     if (!canCreate) {
//       showError('You do not have permission to add mappings');
//       return;
//     }
//     setFormMode('add');
//     setFormType(filterType || 'color');
//     setFormVehicleType(filterVehicleType || 'EV');
//     setFormDmsName('');
//     setFormMisName('');
//     setFormRemarks('');
//     setEditingId(null);
//     setFormError('');
//     resetLookupState();
//     setFormModalOpen(true);
//   };

//   const openEditModal = (mapping) => {
//     if (!canUpdate) {
//       showError('You do not have permission to edit mappings');
//       return;
//     }
//     setFormMode('edit');
//     setFormType(mapping.type);
//     setFormVehicleType(mapping.vehicle_type || 'EV');
//     setFormDmsName(mapping.dms_name);
//     setFormMisName(mapping.mis_name || '');
//     setFormRemarks(mapping.remarks || '');
//     setEditingId(mapping._id);
//     setFormError('');
//     resetLookupState();
//     setFormModalOpen(true);
//   };

//   const resetFormModal = () => {
//     setFormModalOpen(false);
//     setFormError('');
//     setMisModels([]);
//     setDmsModels([]);
//     setDmsModelsError('');
//   };

//   const handleFormTypeChange = (newType) => {
//     setFormType(newType);
//     setFormDmsName('');
//     setFormMisName('');
//     resetLookupState();
//   };

//   // Changing Vehicle Type clears the previously selected items
//   const handleFormVehicleTypeChange = (newVehicleType) => {
//     setFormVehicleType(newVehicleType);
//     setSelectedMisModelId(null);
//     setSelectedDmsModelId(null);
//     setFormDmsName('');
//     setFormMisName('');
//   };

//   const handleFormSubmit = async () => {
//     if (!formVehicleType) {
//       setFormError('Vehicle type is required');
//       return;
//     }
//     if (!formDmsName.trim()) {
//       setFormError('DMS name is required');
//       return;
//     }

//     setFormLoading(true);
//     setFormError('');
//     try {
//       if (formMode === 'add') {
//         await axiosInstance.post('/advance-model-mapping', {
//           type: formType,
//           vehicle_type: formVehicleType,
//           dms_name: formDmsName.trim(),
//           mis_name: formMisName.trim() || undefined,
//           remarks: formRemarks.trim() || undefined
//         });
//         showSuccess('Mapping added successfully!');
//       } else {
//         await axiosInstance.put(`/advance-model-mapping/${editingId}`, {
//           type: formType,
//           vehicle_type: formVehicleType,
//           dms_name: formDmsName.trim(),
//           mis_name: formMisName.trim() || null,
//           remarks: formRemarks.trim() || null
//         });
//         showSuccess('Mapping updated successfully!');
//       }
//       resetFormModal();
//       fetchData();
//     } catch (err) {
//       const message = err.response?.data?.message || 'Failed to save mapping';
//       setFormError(message);
//       showError(message);
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   // ---------------------------------------------------------------------
//   // Delete
//   // ---------------------------------------------------------------------
//   const handleDelete = async (id) => {
//     if (!canDelete) {
//       showError('You do not have permission to delete mappings');
//       return;
//     }
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/advance-model-mapping/${id}`);
//         showSuccess('Mapping deactivated successfully!');
//         fetchData();
//       } catch (err) {
//         showError(err.response?.data?.message || 'Failed to delete mapping');
//       }
//     }
//   };

//   // ---------------------------------------------------------------------
//   // Export
//   // ---------------------------------------------------------------------
//   const handleExport = async () => {
//     setExportLoading(true);
//     try {
//       const params = new URLSearchParams();
//       params.append('type', exportType);
//       if (exportVehicleType) params.append('vehicle_type', exportVehicleType);

//       const response = await axiosInstance.get(
//         `/advance-model-mapping/export?${params.toString()}`,
//         { responseType: 'blob' }
//       );

//       const blob = new Blob([response.data], {
//         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//       });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute(
//         'download',
//         `Advance_Model_Mapping_${exportType}_${new Date().toLocaleDateString()}.xlsx`
//       );
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);

//       setExportModalOpen(false);
//       showSuccess('Excel exported successfully!');
//     } catch (err) {
//       console.error('Export failed:', err);
//       showError('Failed to export Excel');
//     } finally {
//       setExportLoading(false);
//     }
//   };

//   // ---------------------------------------------------------------------
//   // Import
//   // ---------------------------------------------------------------------
//   const handleImportFileChange = (e) => {
//     setImportFile(e.target.files[0]);
//   };

//   const resetImportModal = () => {
//     setImportModalOpen(false);
//     setImportFile(null);
//     setImportResult(null);
//   };

//   const handleImport = async () => {
//     if (!importFile) {
//       showError('Please select a file');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', importFile);
//     formData.append('type', importType);

//     setImportLoading(true);
//     setImportResult(null);
//     try {
//       const response = await axiosInstance.post('/advance-model-mapping/import', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
//       setImportResult(response.data);
//       showSuccess(response.data.message || 'Import completed');
//       fetchData();
//     } catch (err) {
//       const message = err.response?.data?.message || 'Failed to import file';
//       showError(message);
//       setImportResult(err.response?.data || null);
//     } finally {
//       setImportLoading(false);
//     }
//   };

//   if (loading && mappings.length === 0) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" />
//       </div>
//     );
//   }

//   if (!canView) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Advance Model Mapping.
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="alert alert-danger" role="alert">
//         {error}
//       </div>
//     );
//   }

//   const startRecord = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
//   const endRecord = Math.min(pagination.page * pagination.limit, pagination.total);

//   let startPage = Math.max(1, pagination.page - 2);
//   let endPage = Math.min(pagination.pages, pagination.page + 2);
//   if (pagination.page <= 3) endPage = Math.min(5, pagination.pages);
//   if (pagination.page >= pagination.pages - 2) startPage = Math.max(1, pagination.pages - 4);
//   const displayedPages = [];
//   for (let i = startPage; i <= endPage; i++) displayedPages.push(i);

//   return (
//     <div>
//       <style>{`
//         .advance-mapping-tabs .nav-link {
//           color: #6b7280;
//           font-weight: 500;
//           border-bottom: 2px solid transparent;
//           padding: 8px 16px;
//         }
//         .advance-mapping-tabs .nav-link.active {
//           color: #2563eb;
//           font-weight: 600;
//           border-bottom: 2px solid #2563eb;
//           background: transparent;
//         }
//         .advance-mapping-tabs .nav-link:hover {
//           color: #2563eb;
//         }

//         .pill-action-btn {
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           border-radius: 6px;
//           padding: 5px 12px;
//           font-size: 13px;
//           font-weight: 500;
//           border: none;
//           line-height: 1.4;
//         }
//         .pill-action-btn svg,
//         .pill-action-btn .c-icon,
//         .pill-action-btn .icon {
//           width: 15px;
//           height: 15px;
//         }
//         .pill-action-btn-primary {
//           background-color: #2563eb;
//           color: #fff;
//         }
//         .pill-action-btn-primary:hover {
//           background-color: #1d4ed8;
//           color: #fff;
//         }
//         .pill-action-btn-outline {
//           background-color: #fff;
//           color: #374151;
//           border: 1px solid #d1d5db;
//         }
//         .pill-action-btn-outline:hover {
//           background-color: #f3f4f6;
//           color: #374151;
//         }

//         .options-dropdown-btn {
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           gap: 6px;
//           border-radius: 6px;
//           padding: 5px 12px;
//           font-size: 13px;
//           font-weight: 500;
//           background-color: #fff;
//           color: #374151;
//           border: 1px solid #d1d5db;
//         }
//         .options-dropdown-btn:hover,
//         .options-dropdown-btn:focus,
//         .options-dropdown-btn:active {
//           background-color: #f3f4f6 !important;
//           color: #374151 !important;
//           border-color: #d1d5db !important;
//         }
//         .options-dropdown-btn::after {
//           display: none;
//         }
//         .options-dropdown-menu .dropdown-item {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           font-size: 13px;
//           padding: 8px 14px;
//         }
//         .options-dropdown-menu .dropdown-item.text-danger:hover {
//           background-color: #fef2f2;
//         }

//         .autocomplete-field-wrap {
//           position: relative;
//         }
//         .autocomplete-suggestions {
//           position: absolute;
//           top: 100%;
//           left: 0;
//           right: 0;
//           z-index: 1060;
//           background: #fff;
//           border: 1px solid #d1d5db;
//           border-top: none;
//           border-radius: 0 0 6px 6px;
//           max-height: 220px;
//           overflow-y: auto;
//           box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
//         }
//         .autocomplete-suggestion-item {
//           padding: 8px 12px;
//           font-size: 14px;
//           cursor: pointer;
//         }
//         .autocomplete-suggestion-item:hover {
//           background-color: #f3f4f6;
//         }
//         .autocomplete-suggestion-item.disabled {
//           cursor: default;
//           color: #9ca3af;
//         }
//         .autocomplete-suggestion-item.disabled:hover {
//           background-color: transparent;
//         }
//       `}</style>
//       <div className="title">Advance Model Mapping</div>

//       <CCard className="table-container mt-4">
//         <CCardHeader className="card-header d-flex justify-content-between align-items-center">
//           <div>
//             {canCreate && (
//               <CButton size="sm" className="action-btn me-1" onClick={openAddModal}>
//                 <CIcon icon={cilPlus} className="icon" /> New Mapping
//               </CButton>
//             )}

//             <CButton
//               size="sm"
//               className="action-btn me-1"
//               onClick={() => setExportModalOpen(true)}
//             >
//               <CIcon icon={cilCloudDownload} className="icon" /> Export Excel
//             </CButton>

//             {canCreate && (
//               <CButton
//                 size="sm"
//                 className="action-btn me-1"
//                 onClick={() => setImportModalOpen(true)}
//               >
//                 <CIcon icon={cilCloudUpload} className="icon" /> Import Excel
//               </CButton>
//             )}
//           </div>
//         </CCardHeader>

//         <CCardBody>
//           <CNav variant="underline" className="mb-3 advance-mapping-tabs">
//             <CNavItem>
//               <CNavLink
//                 active={filterType === 'color'}
//                 onClick={() => {
//                   setFilterType('color');
//                   setPagination((prev) => ({ ...prev, page: 1 }));
//                 }}
//                 style={{ cursor: 'pointer' }}
//               >
//                 Colour
//               </CNavLink>
//             </CNavItem>
//             <CNavItem>
//               <CNavLink
//                 active={filterType === 'model'}
//                 onClick={() => {
//                   setFilterType('model');
//                   setPagination((prev) => ({ ...prev, page: 1 }));
//                 }}
//                 style={{ cursor: 'pointer' }}
//               >
//                 Model
//               </CNavLink>
//             </CNavItem>
//           </CNav>

//           <div className="d-flex justify-content-between mb-3 align-items-center flex-wrap gap-2">
//             <div className="d-flex align-items-center">
//               <CFormLabel className="mb-0 me-2">Rows per page:</CFormLabel>
//               <CFormSelect
//                 value={pagination.limit}
//                 onChange={(e) => handleLimitChange(e.target.value)}
//                 style={{ width: '80px' }}
//                 size="sm"
//               >
//                 {PAGE_SIZE_OPTIONS.map((option) => (
//                   <option key={option} value={option}>
//                     {option}
//                   </option>
//                 ))}
//               </CFormSelect>

//               <CFormLabel className="mb-0 ms-3 me-2">Vehicle Type:</CFormLabel>
//               <CFormSelect
//                 value={filterVehicleType}
//                 onChange={(e) => {
//                   setFilterVehicleType(e.target.value);
//                   setPagination((prev) => ({ ...prev, page: 1 }));
//                 }}
//                 style={{ width: '110px' }}
//                 size="sm"
//               >
//                 <option value="">All</option>
//                 <option value="EV">EV</option>
//                 <option value="ICE">ICE</option>
//               </CFormSelect>
//             </div>

//             <div className="d-flex align-items-center">
//               <CFormLabel className="mt-1 m-1">Search:</CFormLabel>
//               <CFormInput
//                 type="text"
//                 className="d-inline-block square-search"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search by DMS or MIS name..."
//                 style={{ width: '250px' }}
//               />
//             </div>
//           </div>

//           {loading && (
//             <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
//               <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
//             </div>
//           )}

//           <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
//             <CTable striped bordered hover className="responsive-table">
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Type</CTableHeaderCell>
//                   <CTableHeaderCell>Vehicle Type</CTableHeaderCell>
//                   <CTableHeaderCell>DMS Name</CTableHeaderCell>
//                   <CTableHeaderCell>MIS Name</CTableHeaderCell>
//                   <CTableHeaderCell>Remarks</CTableHeaderCell>
//                   <CTableHeaderCell>Status</CTableHeaderCell>
//                   {(canUpdate || canDelete) && <CTableHeaderCell>Action</CTableHeaderCell>}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {mappings.length === 0 && !loading ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan={(canUpdate || canDelete) ? '8' : '7'} className="text-center">
//                       {searchTerm ? `No results found for "${searchTerm}"` : 'No mappings available'}
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   mappings.map((mapping, index) => {
//                     const globalIndex = (pagination.page - 1) * pagination.limit + index + 1;
//                     return (
//                       <CTableRow key={mapping._id}>
//                         <CTableDataCell>{globalIndex}</CTableDataCell>
//                         <CTableDataCell>
//                           <CBadge color={mapping.type === 'color' ? 'info' : 'primary'}>
//                             {mapping.type === 'color' ? 'Colour' : 'Model'}
//                           </CBadge>
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {mapping.vehicle_type ? (
//                             <CBadge color={mapping.vehicle_type === 'EV' ? 'success' : 'warning'}>
//                               {mapping.vehicle_type}
//                             </CBadge>
//                           ) : (
//                             '—'
//                           )}
//                         </CTableDataCell>
//                         <CTableDataCell>{mapping.dms_name}</CTableDataCell>
//                         <CTableDataCell>{mapping.mis_name || '—'}</CTableDataCell>
//                         <CTableDataCell>{mapping.remarks || '—'}</CTableDataCell>
//                         <CTableDataCell>
//                           <CBadge color={mapping.status === 'active' ? 'success' : 'secondary'}>
//                             {mapping.status}
//                           </CBadge>
//                         </CTableDataCell>
//                         {(canUpdate || canDelete) && (
//                           <CTableDataCell>
//                             <CDropdown alignment="end">
//                               <CDropdownToggle
//                                 size="sm"
//                                 className="options-dropdown-btn"
//                                 caret={false}
//                               >
//                                 <CIcon icon={cilSettings} />
//                                 Options
//                               </CDropdownToggle>
//                               <CDropdownMenu className="options-dropdown-menu">
//                                 {canUpdate && (
//                                   <CDropdownItem
//                                     style={{ cursor: 'pointer' }}
//                                     onClick={() => openEditModal(mapping)}
//                                   >
//                                     <CIcon icon={cilPencil} />
//                                     Edit
//                                   </CDropdownItem>
//                                 )}
//                                 {canDelete && (
//                                   <CDropdownItem
//                                     className="text-danger"
//                                     style={{ cursor: 'pointer' }}
//                                     onClick={() => handleDelete(mapping._id)}
//                                   >
//                                     <CIcon icon={cilTrash} />
//                                     Delete
//                                   </CDropdownItem>
//                                 )}
//                               </CDropdownMenu>
//                             </CDropdown>
//                           </CTableDataCell>
//                         )}
//                       </CTableRow>
//                     );
//                   })
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>

//           {pagination.total > 0 && (
//             <div className="mt-4">
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <span className="text-muted" style={{ fontSize: '13px' }}>
//                   {loading ? 'Loading…' : `Showing ${startRecord}–${endRecord} of ${pagination.total} records`}
//                 </span>
//               </div>

//               {pagination.pages > 1 && (
//                 <CPagination align="center" aria-label="Page navigation">
//                   <CPaginationItem
//                     aria-label="Previous"
//                     onClick={() => handlePageChange(pagination.page - 1)}
//                     disabled={pagination.page === 1 || loading}
//                   >
//                     <CIcon icon={cilChevronLeft} />
//                   </CPaginationItem>

//                   {displayedPages.map((page) => (
//                     <CPaginationItem
//                       key={page}
//                       onClick={() => handlePageChange(page)}
//                       active={pagination.page === page}
//                       disabled={loading}
//                     >
//                       {page}
//                     </CPaginationItem>
//                   ))}

//                   <CPaginationItem
//                     aria-label="Next"
//                     onClick={() => handlePageChange(pagination.page + 1)}
//                     disabled={pagination.page === pagination.pages || loading}
//                   >
//                     <CIcon icon={cilChevronRight} />
//                   </CPaginationItem>
//                 </CPagination>
//               )}
//             </div>
//           )}
//         </CCardBody>
//       </CCard>

//       {/* Add / Edit Modal */}
//       <CModal visible={formModalOpen} onClose={resetFormModal}>
//         <CModalHeader>
//           <CModalTitle>{formMode === 'add' ? 'Add Mapping' : 'Edit Mapping'}</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {formError && <CAlert color="danger">{formError}</CAlert>}

//           <div className="mb-3">
//             <CFormLabel>Type<span className="required">*</span></CFormLabel>
//             <CFormSelect
//               value={formType}
//               onChange={(e) => handleFormTypeChange(e.target.value)}
//               disabled={formMode === 'edit'}
//             >
//               <option value="color">Colour</option>
//               <option value="model">Model</option>
//             </CFormSelect>
//           </div>

//           <div className="mb-3">
//             <CFormLabel>Vehicle Type<span className="required">*</span></CFormLabel>
//             <CFormSelect
//               value={formVehicleType}
//               onChange={(e) => handleFormVehicleTypeChange(e.target.value)}
//             >
//               <option value="EV">EV</option>
//               <option value="ICE">ICE</option>
//             </CFormSelect>
//           </div>

//           {/* Show model dropdowns only when type is "model" */}
//           {formType === 'model' && (
//             <>
//               {/* MIS Model Dropdown */}
//               <div className="mb-3">
//                 <CFormLabel>MIS Vehicle Model</CFormLabel>
//                 <Select
//                   classNamePrefix="react-select"
//                   placeholder={misModelsLoading ? 'Loading MIS models...' : '- Select MIS Model -'}
//                   isLoading={misModelsLoading}
//                   isClearable
//                   options={misModelOptions}
//                   value={selectedMisOption}
//                   onChange={handleMisModelSelect}
//                 />
//                 <small className="text-muted">
//                   MIS Models filtered by {formVehicleType} vehicle type
//                 </small>
//               </div>

//               {/* DMS Model Dropdown - Fetched from /advantage-approval/pending API */}
//               <div className="mb-3">
//                 <CFormLabel>DMS Vehicle Model<span className="required">*</span></CFormLabel>
//                 <Select
//                   classNamePrefix="react-select"
//                   placeholder={dmsModelsLoading ? 'Loading DMS models...' : '- Select DMS Model -'}
//                   isLoading={dmsModelsLoading}
//                   isClearable
//                   options={dmsModelOptions}
//                   value={selectedDmsOption}
//                   onChange={handleDmsModelSelect}
//                   noOptionsMessage={() =>
//                     dmsModelsError || 'No options'
//                   }
//                 />
//                 <small className={dmsModelsError ? 'text-danger' : 'text-muted'}>
//                   {dmsModelsError || 'DMS Models fetched from advantage-approval API'}
//                 </small>
//               </div>
//             </>
//           )}

//           {/* For Color type - show manual input fields */}
//           {formType === 'color' && (
//             <>
//               {/* MIS Color Name with autocomplete suggestions */}
//               <div className="mb-3 autocomplete-field-wrap">
//                 <CFormLabel>MIS Vehicle Colour</CFormLabel>
//                 <CFormInput
//                   value={formMisName}
//                   onChange={(e) => handleMisNameInputChange(e.target.value)}
//                   onFocus={() => {
//                     setShowMisSuggestions(true);
//                     searchMisNames(formType, formMisName, setMisSuggestions);
//                   }}
//                   onBlur={() => setTimeout(() => setShowMisSuggestions(false), 150)}
//                   placeholder="e.g. PEARL WHITE"
//                   autoComplete="off"
//                 />
//                 {showMisSuggestions && (
//                   <div className="autocomplete-suggestions">
//                     {misNamesLoadingType === formType ? (
//                       <div className="autocomplete-suggestion-item disabled">Loading…</div>
//                     ) : misSuggestions.length > 0 ? (
//                       misSuggestions.map((name) => (
//                         <div
//                           key={name}
//                           className="autocomplete-suggestion-item"
//                           onMouseDown={() => handleSelectMisSuggestion(name)}
//                         >
//                           {name}
//                         </div>
//                       ))
//                     ) : (
//                       <div className="autocomplete-suggestion-item disabled">
//                         No previously used values found
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* DMS Color - manual text input */}
//               <div className="mb-3">
//                 <CFormLabel>DMS Vehicle Colour<span className="required">*</span></CFormLabel>
//                 <CFormInput
//                   value={formDmsName}
//                   onChange={(e) => setFormDmsName(e.target.value)}
//                   placeholder="e.g. IQUBE ST-PEARL WHITE"
//                   autoComplete="off"
//                 />
//               </div>
//             </>
//           )}

//           <div className="mb-3">
//             <CFormLabel>Remarks</CFormLabel>
//             <CFormTextarea
//               value={formRemarks}
//               onChange={(e) => setFormRemarks(e.target.value)}
//               rows={2}
//             />
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={resetFormModal} disabled={formLoading}>
//             Cancel
//           </CButton>
//           <CButton className="submit-button" onClick={handleFormSubmit} disabled={formLoading}>
//             {formLoading ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 Saving...
//               </>
//             ) : (
//               'Save'
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Export Modal */}
//       <CModal visible={exportModalOpen} onClose={() => setExportModalOpen(false)}>
//         <CModalHeader>
//           <CModalTitle>Export Excel</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <CFormLabel>Type:</CFormLabel>
//             <CFormSelect value={exportType} onChange={(e) => setExportType(e.target.value)}>
//               <option value="color">Colour</option>
//               <option value="model">Model</option>
//             </CFormSelect>
//           </div>

//           <div className="mb-3">
//             <CFormLabel>Vehicle Type:</CFormLabel>
//             <CFormSelect
//               value={exportVehicleType}
//               onChange={(e) => setExportVehicleType(e.target.value)}
//             >
//               <option value="">All</option>
//               <option value="EV">EV</option>
//               <option value="ICE">ICE</option>
//             </CFormSelect>
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton className="submit-button" onClick={handleExport} disabled={exportLoading}>
//             {exportLoading ? 'Exporting...' : 'Export'}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Import Modal */}
//       <CModal visible={importModalOpen} onClose={resetImportModal}>
//         <CModalHeader>
//           <CModalTitle>Import Excel</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <CFormLabel>Type:</CFormLabel>
//             <CFormSelect value={importType} onChange={(e) => setImportType(e.target.value)}>
//               <option value="color">Colour</option>
//               <option value="model">Model</option>
//             </CFormSelect>
//           </div>

//           <div className="mb-3">
//             <CFormLabel>Select Excel/CSV File:</CFormLabel>
//             <CFormInput
//               type="file"
//               id="advance-mapping-import-file"
//               accept=".xlsx,.xls,.csv"
//               onChange={handleImportFileChange}
//             />
//             <small className="text-muted">Supported formats: .xlsx, .xls, .csv</small>
//           </div>

//           {importFile && (
//             <CAlert color="info">
//               Selected file: {importFile.name} ({(importFile.size / 1024).toFixed(2)} KB)
//             </CAlert>
//           )}

//           {importResult && (
//             <CAlert color={importResult.status === 'success' ? 'success' : 'warning'}>
//               <div className="d-flex align-items-center mb-2">
//                 <CIcon
//                   icon={importResult.status === 'success' ? cilCheckCircle : cilWarning}
//                   className="me-2"
//                 />
//                 {importResult.message}
//               </div>
//               {importResult.summary && (
//                 <ul className="mb-0">
//                   <li>Total rows: {importResult.summary.totalRows}</li>
//                   <li>Created: {importResult.summary.created}</li>
//                   <li>Updated: {importResult.summary.updated}</li>
//                   <li>Skipped: {importResult.summary.skipped}</li>
//                 </ul>
//               )}
//             </CAlert>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={resetImportModal} disabled={importLoading}>
//             Close
//           </CButton>
//           <CButton
//             className="submit-button"
//             onClick={handleImport}
//             disabled={!importFile || importLoading}
//           >
//             {importLoading ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 Importing...
//               </>
//             ) : (
//               'Import'
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </div>
//   );
// };

// export default AdvantageModelMapping;


import '../../css/table.css';
import '../../css/form.css';
import {
  React,
  useState,
  useEffect,
  getDefaultSearchFields,
  useTableFilter,
  confirmDelete,
  showError,
  showSuccess,
  axiosInstance
} from '../../utils/tableImports';
import {
  hasSafePagePermission,
  MODULES,
  PAGES,
  ACTIONS,
  canViewPage,
  canCreateInPage,
  canUpdateInPage,
  canDeleteInPage
} from '../../utils/modulePermissions';
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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormSelect,
  CFormTextarea,
  CAlert,
  CPagination,
  CPaginationItem,
  CNav,
  CNavItem,
  CNavLink,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilPlus,
  cilSearch,
  cilSettings,
  cilPencil,
  cilTrash,
  cilCloudDownload,
  cilCloudUpload,
  cilCheckCircle,
  cilWarning,
  cilChevronLeft,
  cilChevronRight
} from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import Select from 'react-select';

// ============================================================
// ERROR HANDLING UTILITY
// ============================================================
const handleApiError = (error) => {
  let errorMessage = 'An unexpected error occurred. Please try again.';

  if (error.response) {
    const { status, data } = error.response;

    if (data) {
      if (data.error) {
        errorMessage = data.error;
      } else if (data.message) {
        errorMessage = data.message;
      } else if (data.detail) {
        errorMessage = data.detail;
      } else if (data.errors) {
        if (Array.isArray(data.errors)) {
          errorMessage = data.errors.join(', ');
        } else if (typeof data.errors === 'object') {
          const errorMessages = Object.values(data.errors).flat();
          errorMessage = errorMessages.join(', ');
        } else {
          errorMessage = data.errors;
        }
      } else if (typeof data === 'string') {
        errorMessage = data;
      }
    }

    if (
      errorMessage === 'An unexpected error occurred. Please try again.' ||
      errorMessage === 'Server Error'
    ) {
      switch (status) {
        case 400:
          errorMessage = 'Validation error. Please check your input.';
          break;
        case 401:
          errorMessage = 'Authentication required. Please log in again.';
          break;
        case 403:
          errorMessage = 'You do not have permission to perform this action.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 409:
          errorMessage =
            'Conflict: The resource already exists or there is a data conflict.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          break;
      }
    }
  } else if (error.request) {
    errorMessage = 'No response from server. Please check your network connection.';
  } else {
    errorMessage = error.message || errorMessage;
  }

  return errorMessage;
};

const showErrorMessage = (error) => {
  const message = handleApiError(error);
  showError(message);
  return message;
};

// ============================================================
// PAGE SIZE CONSTANTS
// ============================================================
const PAGE_SIZE_OPTIONS = [25, 50, 100];
const DEFAULT_LIMIT = 25;

const AdvantageModelMapping = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Server-side state
  const [mappings, setMappings] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: DEFAULT_LIMIT,
    total: 0,
    pages: 1
  });

  // Search / filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('color');
  const [filterVehicleType, setFilterVehicleType] = useState('');
  const searchTimer = useRef(null);

  // Add/Edit modal state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [formType, setFormType] = useState('color');
  // NOTE: vehicle_type is no longer user-editable; kept internally to send to backend
  const [formVehicleType, setFormVehicleType] = useState('EV');
  const [formDmsName, setFormDmsName] = useState('');
  const [formMisName, setFormMisName] = useState('');
  const [formRemarks, setFormRemarks] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // ---- MIS Models (from /models/all/status API) ----
  const [misModels, setMisModels] = useState([]);
  const [misModelsLoading, setMisModelsLoading] = useState(false);

  // ---- DMS Models (from /advantage-approval/pending API) ----
  const [dmsModels, setDmsModels] = useState([]);
  const [dmsModelsLoading, setDmsModelsLoading] = useState(false);
  const [dmsModelsError, setDmsModelsError] = useState('');

  // ---- Color options for selected MIS model ----
  const [colorOptions, setColorOptions] = useState([]);
  const [colorOptionsLoading, setColorOptionsLoading] = useState(false);
  const [selectedMisModelForColor, setSelectedMisModelForColor] = useState(null);

  // ---- MIS name suggestions (from previously saved mis_name values) ----
  const [misNamesCache, setMisNamesCache] = useState({});
  const [misNamesLoadingType, setMisNamesLoadingType] = useState(null);
  const misNamesLoadPromise = useRef({});
  const [misSuggestions, setMisSuggestions] = useState([]);
  const [showMisSuggestions, setShowMisSuggestions] = useState(false);
  const misSearchTimer = useRef(null);

  // Export modal state
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportType, setExportType] = useState('color');
  const [exportVehicleType, setExportVehicleType] = useState('EV');
  const [exportLoading, setExportLoading] = useState(false);

  // Import modal state
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importType, setImportType] = useState('color');
  const [importVehicleType, setImportVehicleType] = useState('EV');
  const [importFile, setImportFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [importError, setImportError] = useState('');

  // ---- Selected IDs for dropdowns ----
  const [selectedMisModelId, setSelectedMisModelId] = useState(null);
  const [selectedDmsModelId, setSelectedDmsModelId] = useState(null);

  const { permissions = [] } = useTableFilter ? { permissions: [] } : { permissions: [] };
  const navigate = useNavigate();

  const canView = true;
  const canCreate = true;
  const canUpdate = true;
  const canDelete = true;

  // ============================================================
  // COMPUTED VALUES
  // ============================================================

  // MIS Model options
  const misModelOptions = misModels.map((item) => ({
    value: item._id || item.id,
    label: item.model_name || item.name || ''
  }));

  // DMS Model options
  const dmsModelOptions = dmsModels.map((item) => ({
    value: item._id || item.id,
    label: item.dms_name || item.name || item.model_name || ''
  }));

  const selectedMisOption = selectedMisModelId
    ? misModelOptions.find((opt) => opt.value === selectedMisModelId) || null
    : null;

  const selectedDmsOption = selectedDmsModelId
    ? dmsModelOptions.find((opt) => opt.value === selectedDmsModelId) || null
    : null;

  // ============================================================
  // EFFECTS
  // ============================================================
  useEffect(() => {
    fetchData();
  }, [pagination.page, pagination.limit, filterType, filterVehicleType]);

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setPagination((prev) => ({ ...prev, page: 1 }));
      fetchData(1, pagination.limit, searchTerm);
    }, 500);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [searchTerm]);

  // Load models when form modal opens (and re-run if formType changes)
  useEffect(() => {
    if (!formModalOpen) return;

    if (formType === 'model') {
      fetchMisModels();
      fetchDmsModels(formVehicleType);
    } else if (formType === 'color') {
      fetchMisModels();
      fetchDmsModels(formVehicleType);
      setColorOptions([]);
      setSelectedMisModelForColor(null);
    }
  }, [formModalOpen, formType, formVehicleType]);

  // ============================================================
  // AUTO-SELECT helpers (edit mode)
  // ============================================================

  // When MIS models finish loading in edit mode, auto-select by matching mis_name
  useEffect(() => {
    if (!formModalOpen || formMode !== 'edit' || !formMisName || misModels.length === 0) {
      return;
    }
    // Skip if already selected
    if (selectedMisModelId) return;

    const target = formMisName.trim().toLowerCase();
    const match = misModels.find((m) => {
      const name = (m.model_name || m.name || '').trim().toLowerCase();
      return name === target;
    });

    if (match) {
      const id = match._id || match.id;
      setSelectedMisModelId(id);

      if (formType === 'color') {
        setSelectedMisModelForColor(id);
        fetchColorsForModel(id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [misModels, formModalOpen, formMode, formMisName]);

  // When DMS models finish loading in edit mode, auto-select by matching dms_name
  useEffect(() => {
    if (!formModalOpen || formMode !== 'edit' || !formDmsName || dmsModels.length === 0) {
      return;
    }
    if (selectedDmsModelId) return;

    const target = formDmsName.trim().toLowerCase();
    const match = dmsModels.find((m) => {
      const name = (m.dms_name || m.name || m.model_name || '').trim().toLowerCase();
      return name === target;
    });

    if (match) {
      setSelectedDmsModelId(match._id || match.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dmsModels, formModalOpen, formMode, formDmsName]);

  // When color options finish loading in edit mode, auto-select by matching mis_name
  useEffect(() => {
    if (
      !formModalOpen ||
      formMode !== 'edit' ||
      formType !== 'color' ||
      !formMisName ||
      colorOptions.length === 0
    ) {
      return;
    }

    const target = formMisName.trim().toLowerCase();
    const match = colorOptions.find(
      (c) => (c.label || '').trim().toLowerCase() === target
    );

    // Nothing extra to do — value binding uses formMisName match already
    // (react-select `value` is derived from formMisName in the JSX below)
    // eslint-disable-next-line no-unused-vars
    const _ = match;
  }, [colorOptions, formModalOpen, formMode, formType, formMisName]);

  // ============================================================
  // DATA FETCHING
  // ============================================================
  const extractArrayFromResponse = (body) => {
    if (!body) return [];
    if (Array.isArray(body)) return body;

    const candidates = [
      body.data?.vehicles,
      body.data,
      body.data?.data,
      body.data?.records,
      body.data?.data?.records,
      body.data?.results,
      body.data?.items,
      body.records,
      body.results,
      body.items
    ];

    for (const candidate of candidates) {
      if (Array.isArray(candidate)) return candidate;
    }
    return [];
  };

  const extractList = (body, key) => {
    if (!body) return [];
    if (Array.isArray(body)) return body;
    if (Array.isArray(body?.data?.[key])) return body.data[key];
    if (Array.isArray(body?.[key])) return body[key];
    if (Array.isArray(body?.data)) return body.data;
    return [];
  };

  const fetchData = async (page = pagination.page, limit = pagination.limit, search = searchTerm) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      if (search && search.trim()) params.append('search', search.trim());
      if (filterType) params.append('type', filterType);
      if (filterVehicleType) params.append('vehicle_type', filterVehicleType);

      const response = await axiosInstance.get(`/advance-model-mapping?${params.toString()}`);
      const body = response.data;

      setMappings(body.data || []);
      setPagination({
        page: body.page || 1,
        limit,
        total: body.total || 0,
        pages: body.pages || 1
      });
      setError(null);
    } catch (err) {
      const message = handleApiError(err);
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchColorsForModel = async (modelId) => {
    if (!modelId) {
      setColorOptions([]);
      return;
    }

    setColorOptionsLoading(true);
    try {
      const response = await axiosInstance.get(`/colors/model/${modelId}`);

      let colors = [];
      if (response.data?.data?.colors) {
        colors = response.data.data.colors;
      } else if (Array.isArray(response.data?.data)) {
        colors = response.data.data;
      } else if (Array.isArray(response.data)) {
        colors = response.data;
      }

      const formattedColors = colors.map((color) => ({
        value: color.id || color._id || color,
        label: color.name || color.color_name || color
      }));

      setColorOptions(formattedColors);
    } catch (error) {
      console.error('Error fetching colors for model:', error);
      const message = handleApiError(error);
      showError(message);
      setColorOptions([]);
    } finally {
      setColorOptionsLoading(false);
    }
  };

  // Fetch MIS Models — no vehicle-type filtering
  const fetchMisModels = async () => {
    setMisModelsLoading(true);
    try {
      const response = await axiosInstance.get('/models/all/status');
      const list = extractList(response.data, 'models');
      setMisModels(list);
      return list;
    } catch (error) {
      console.error('Error loading MIS models:', error);
      const message = handleApiError(error);
      showError(message);
      setMisModels([]);
      return [];
    } finally {
      setMisModelsLoading(false);
    }
  };

  // Fetch DMS Models — still filtered by vehicle type (from record/legacy)
  const fetchDmsModels = async (vehicleType) => {
    if (!vehicleType) return [];

    setDmsModelsLoading(true);
    setDmsModelsError('');
    try {
      const response = await axiosInstance.get('/advantage-approval/pending', {
        params: { page: 1, limit: 100 }
      });

      const list = extractArrayFromResponse(response.data);

      const normalize = (val) => (val || '').toString().trim().toUpperCase();
      const targetType = normalize(vehicleType);

      const filtered = list.filter((item) => {
        const itemType = normalize(
          item.type ||
            item.vehicleType ||
            item.vehicle_type ||
            item.vehicle?.type ||
            item.stockData?.vehicleType ||
            item.stockData?.type
        );
        if (!itemType) return true;
        return itemType === targetType;
      });

      const seen = new Set();
      const withIds = [];
      filtered.forEach((item, idx) => {
        const dmsName = (
          item.dmsToMisMapping?.model?.dms ||
          item.stockData?.vehicleModel ||
          item.dms_name ||
          item.name ||
          item.model_name ||
          ''
        ).trim();

        if (!dmsName || seen.has(dmsName)) return;
        seen.add(dmsName);

        withIds.push({
          ...item,
          _id:
            item.stockData?.chassisNumber ||
            item.id ||
            item._id ||
            `dms-${idx}-${dmsName}`,
          name: dmsName,
          dms_name: dmsName
        });
      });

      setDmsModels(withIds);

      if (withIds.length === 0) {
        setDmsModelsError(
          list.length === 0
            ? 'No pending DMS models were returned by the API.'
            : `No pending DMS models found for vehicle type "${vehicleType}".`
        );
      }

      return withIds;
    } catch (error) {
      console.error('Error loading DMS models:', error);
      const message = handleApiError(error);
      showError(message);
      setDmsModelsError(message);
      setDmsModels([]);
      return [];
    } finally {
      setDmsModelsLoading(false);
    }
  };

  // ============================================================
  // PAGINATION HANDLERS
  // ============================================================
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit) => {
    setPagination((prev) => ({ ...prev, limit: parseInt(newLimit, 10), page: 1 }));
  };

  // ============================================================
  // MIS NAME AUTOCOMPLETE (still used for the manual autocomplete if needed)
  // ============================================================
  const loadMisNames = async (type) => {
    if (misNamesCache[type]) return misNamesCache[type];
    if (misNamesLoadPromise.current[type]) return misNamesLoadPromise.current[type];

    setMisNamesLoadingType(type);
    const promise = axiosInstance
      .get(`/advance-model-mapping?page=1&limit=1000&type=${type}`)
      .then((response) => {
        const rows = response.data?.data || [];
        const names = Array.from(
          new Set(rows.map((r) => (r.mis_name || '').trim()).filter(Boolean))
        ).sort((a, b) => a.localeCompare(b));
        setMisNamesCache((prev) => ({ ...prev, [type]: names }));
        return names;
      })
      .catch(() => [])
      .finally(() => {
        setMisNamesLoadingType((prev) => (prev === type ? null : prev));
        delete misNamesLoadPromise.current[type];
      });

    misNamesLoadPromise.current[type] = promise;
    return promise;
  };

  const filterStrings = (list, query) => {
    const q = (query || '').trim().toLowerCase();
    if (!q) return list.slice(0, 20);
    return list.filter((v) => v.toLowerCase().includes(q)).slice(0, 20);
  };

  const searchMisNames = async (type, query, setSuggestions) => {
    const list = await loadMisNames(type);
    setSuggestions(filterStrings(list, query));
  };

  const handleMisNameInputChange = (value) => {
    setFormMisName(value);
    setShowMisSuggestions(true);
    if (misSearchTimer.current) clearTimeout(misSearchTimer.current);
    misSearchTimer.current = setTimeout(() => {
      searchMisNames(formType, value, setMisSuggestions);
    }, 200);
  };

  const handleSelectMisSuggestion = (name) => {
    setFormMisName(name);
    setShowMisSuggestions(false);
    setMisSuggestions([]);
  };

  const resetLookupState = () => {
    setSelectedMisModelId(null);
    setSelectedDmsModelId(null);
    setMisSuggestions([]);
    setShowMisSuggestions(false);
    setColorOptions([]);
    setSelectedMisModelForColor(null);
  };

  // ============================================================
  // FORM HANDLERS
  // ============================================================
  const handleMisModelSelect = (selectedOption) => {
    const id = selectedOption ? selectedOption.value : null;
    setSelectedMisModelId(id);

    const selectedItem = misModels.find((item) => (item._id || item.id) === id);

    if (selectedOption && selectedItem) {
      const modelName = selectedItem.model_name || selectedItem.name || '';

      if (formType === 'color') {
        const modelId = selectedItem._id || selectedItem.id;
        if (modelId) {
          setSelectedMisModelForColor(modelId);
          fetchColorsForModel(modelId);
          // Reset mis name since colors are tied to this model
          setFormMisName('');
        } else {
          setColorOptions([]);
          setSelectedMisModelForColor(null);
        }
      } else {
        setFormMisName(modelName);
      }
    } else {
      if (formType === 'color') {
        setColorOptions([]);
        setSelectedMisModelForColor(null);
        setFormMisName('');
      } else {
        setFormMisName('');
      }
    }
  };

  const handleDmsModelSelect = (selectedOption) => {
    const id = selectedOption ? selectedOption.value : null;
    setSelectedDmsModelId(id);

    const selectedItem = dmsModels.find((item) => (item._id || item.id) === id);
    if (selectedOption && selectedItem) {
      const dmsName =
        selectedItem.dms_name || selectedItem.name || selectedItem.model_name || '';
      setFormDmsName(dmsName);
    } else {
      setFormDmsName('');
    }
  };

  const openAddModal = () => {
    if (!canCreate) {
      showError('You do not have permission to add mappings');
      return;
    }
    setFormMode('add');
    setFormType(filterType || 'color');
    // vehicle_type still sent to backend; default to EV
    setFormVehicleType('EV');
    setFormDmsName('');
    setFormMisName('');
    setFormRemarks('');
    setEditingId(null);
    setFormError('');
    resetLookupState();
    setFormModalOpen(true);
  };

  const openEditModal = (mapping) => {
    if (!canUpdate) {
      showError('You do not have permission to edit mappings');
      return;
    }
    setFormMode('edit');
    setFormType(mapping.type);
    // Preserve record's vehicle_type so the update payload keeps the same value
    setFormVehicleType(mapping.vehicle_type || 'EV');
    setFormDmsName(mapping.dms_name || '');
    setFormMisName(mapping.mis_name || '');
    setFormRemarks(mapping.remarks || '');
    setEditingId(mapping._id);
    setFormError('');
    resetLookupState();
    setFormModalOpen(true);
  };

  const resetFormModal = () => {
    setFormModalOpen(false);
    setFormError('');
    setMisModels([]);
    setDmsModels([]);
    setDmsModelsError('');
    setColorOptions([]);
    setSelectedMisModelForColor(null);
    setSelectedMisModelId(null);
    setSelectedDmsModelId(null);
  };

  const handleFormTypeChange = (newType) => {
    setFormType(newType);
    setFormDmsName('');
    setFormMisName('');
    setColorOptions([]);
    setSelectedMisModelForColor(null);
    setSelectedMisModelId(null);
    setSelectedDmsModelId(null);
    resetLookupState();
  };

  const handleFormSubmit = async () => {
    if (!formDmsName.trim()) {
      setFormError('DMS name is required');
      return;
    }

    setFormLoading(true);
    setFormError('');
    try {
      if (formMode === 'add') {
        await axiosInstance.post('/advance-model-mapping', {
          type: formType,
          vehicle_type: formVehicleType,
          dms_name: formDmsName.trim(),
          mis_name: formMisName.trim() || undefined,
          remarks: formRemarks.trim() || undefined
        });
        showSuccess('Mapping added successfully!');
      } else {
        await axiosInstance.put(`/advance-model-mapping/${editingId}`, {
          type: formType,
          vehicle_type: formVehicleType,
          dms_name: formDmsName.trim(),
          mis_name: formMisName.trim() || null,
          remarks: formRemarks.trim() || null
        });
        showSuccess('Mapping updated successfully!');
      }
      resetFormModal();
      fetchData();
    } catch (err) {
      const message = handleApiError(err);
      setFormError(message);
      showError(message);
    } finally {
      setFormLoading(false);
    }
  };

  // ============================================================
  // DELETE HANDLER
  // ============================================================
  const handleDelete = async (id) => {
    if (!canDelete) {
      showError('You do not have permission to delete mappings');
      return;
    }
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/advance-model-mapping/${id}`);
        showSuccess('Mapping deactivated successfully!');
        fetchData();
      } catch (err) {
        const message = handleApiError(err);
        showError(message);
      }
    }
  };

  // ============================================================
  // EXPORT HANDLER
  // ============================================================
  const handleExport = async () => {
    setExportLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('type', exportType);
      params.append('vehicle_type', exportVehicleType);

      const response = await axiosInstance.get(
        `/advance-model-mapping/export?${params.toString()}`,
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `Advance_Model_Mapping_${exportType}_${new Date().toLocaleDateString()}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setExportModalOpen(false);
      showSuccess('Excel exported successfully!');
    } catch (err) {
      console.error('Export failed:', err);
      const message = handleApiError(err);
      showError(message);
    } finally {
      setExportLoading(false);
    }
  };

  // ============================================================
  // IMPORT HANDLER
  // ============================================================
  const handleImportFileChange = (e) => {
    setImportFile(e.target.files[0]);
  };

  const resetImportModal = () => {
    setImportModalOpen(false);
    setImportFile(null);
    setImportResult(null);
    setImportError('');
  };

  const handleImport = async () => {
    if (!importFile) {
      showError('Please select a file');
      return;
    }
    if (!importVehicleType) {
      setImportError('Vehicle type is required');
      return;
    }

    const formData = new FormData();
    formData.append('file', importFile);
    formData.append('type', importType);
    formData.append('vehicle_type', importVehicleType);

    setImportLoading(true);
    setImportResult(null);
    setImportError('');
    try {
      const response = await axiosInstance.post('/advance-model-mapping/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImportResult(response.data);
      showSuccess(response.data.message || 'Import completed');
      fetchData();
    } catch (err) {
      const message = handleApiError(err);
      showError(message);
      setImportError(message);
      setImportResult(err.response?.data || null);
    } finally {
      setImportLoading(false);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
  if (loading && mappings.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Advance Model Mapping.
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  const startRecord = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const endRecord = Math.min(pagination.page * pagination.limit, pagination.total);

  let startPage = Math.max(1, pagination.page - 2);
  let endPage = Math.min(pagination.pages, pagination.page + 2);
  if (pagination.page <= 3) endPage = Math.min(5, pagination.pages);
  if (pagination.page >= pagination.pages - 2) startPage = Math.max(1, pagination.pages - 4);
  const displayedPages = [];
  for (let i = startPage; i <= endPage; i++) displayedPages.push(i);

  return (
    <div>
      <style>{`
        .advance-mapping-tabs .nav-link {
          color: #6b7280;
          font-weight: 500;
          border-bottom: 2px solid transparent;
          padding: 8px 16px;
        }
        .advance-mapping-tabs .nav-link.active {
          color: #2563eb;
          font-weight: 600;
          border-bottom: 2px solid #2563eb;
          background: transparent;
        }
        .advance-mapping-tabs .nav-link:hover {
          color: #2563eb;
        }

        .pill-action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          padding: 5px 12px;
          font-size: 13px;
          font-weight: 500;
          border: none;
          line-height: 1.4;
        }
        .pill-action-btn svg,
        .pill-action-btn .c-icon,
        .pill-action-btn .icon {
          width: 15px;
          height: 15px;
        }
        .pill-action-btn-primary {
          background-color: #2563eb;
          color: #fff;
        }
        .pill-action-btn-primary:hover {
          background-color: #1d4ed8;
          color: #fff;
        }
        .pill-action-btn-outline {
          background-color: #fff;
          color: #374151;
          border: 1px solid #d1d5db;
        }
        .pill-action-btn-outline:hover {
          background-color: #f3f4f6;
          color: #374151;
        }

        .options-dropdown-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border-radius: 6px;
          padding: 5px 12px;
          font-size: 13px;
          font-weight: 500;
          background-color: #fff;
          color: #374151;
          border: 1px solid #d1d5db;
        }
        .options-dropdown-btn:hover,
        .options-dropdown-btn:focus,
        .options-dropdown-btn:active {
          background-color: #f3f4f6 !important;
          color: #374151 !important;
          border-color: #d1d5db !important;
        }
        .options-dropdown-btn::after {
          display: none;
        }
        .options-dropdown-menu .dropdown-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          padding: 8px 14px;
        }
        .options-dropdown-menu .dropdown-item.text-danger:hover {
          background-color: #fef2f2;
        }

        .autocomplete-field-wrap {
          position: relative;
        }
        .autocomplete-suggestions {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          z-index: 1060;
          background: #fff;
          border: 1px solid #d1d5db;
          border-top: none;
          border-radius: 0 0 6px 6px;
          max-height: 220px;
          overflow-y: auto;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
        }
        .autocomplete-suggestion-item {
          padding: 8px 12px;
          font-size: 14px;
          cursor: pointer;
        }
        .autocomplete-suggestion-item:hover {
          background-color: #f3f4f6;
        }
        .autocomplete-suggestion-item.disabled {
          cursor: default;
          color: #9ca3af;
        }
        .autocomplete-suggestion-item.disabled:hover {
          background-color: transparent;
        }
      `}</style>
      <div className="title">Advance Model Mapping</div>

      <CCard className="table-container mt-4">
        <CCardHeader className="card-header d-flex justify-content-between align-items-center">
          <div>
            {canCreate && (
              <CButton size="sm" className="action-btn me-1" onClick={openAddModal}>
                <CIcon icon={cilPlus} className="icon" /> New Mapping
              </CButton>
            )}

            <CButton
              size="sm"
              className="action-btn me-1"
              onClick={() => setExportModalOpen(true)}
            >
              <CIcon icon={cilCloudDownload} className="icon" /> Export Excel
            </CButton>

            {canCreate && (
              <CButton
                size="sm"
                className="action-btn me-1"
                onClick={() => setImportModalOpen(true)}
              >
                <CIcon icon={cilCloudUpload} className="icon" /> Import Excel
              </CButton>
            )}
          </div>
        </CCardHeader>

        <CCardBody>
          <CNav variant="underline" className="mb-3 advance-mapping-tabs">
            <CNavItem>
              <CNavLink
                active={filterType === 'color'}
                onClick={() => {
                  setFilterType('color');
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                style={{ cursor: 'pointer' }}
              >
                Colour
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={filterType === 'model'}
                onClick={() => {
                  setFilterType('model');
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                style={{ cursor: 'pointer' }}
              >
                Model
              </CNavLink>
            </CNavItem>
          </CNav>

          <div className="d-flex justify-content-between mb-3 align-items-center flex-wrap gap-2">
            <div className="d-flex align-items-center">
              <CFormLabel className="mb-0 me-2">Rows per page:</CFormLabel>
              <CFormSelect
                value={pagination.limit}
                onChange={(e) => handleLimitChange(e.target.value)}
                style={{ width: '80px' }}
                size="sm"
              >
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </CFormSelect>

              <CFormLabel className="mb-0 ms-3 me-2">Vehicle Type:</CFormLabel>
              <CFormSelect
                value={filterVehicleType}
                onChange={(e) => {
                  setFilterVehicleType(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                style={{ width: '110px' }}
                size="sm"
              >
                <option value="">All</option>
                <option value="EV">EV</option>
                <option value="ICE">ICE</option>
              </CFormSelect>
            </div>

            <div className="d-flex align-items-center">
              <CFormLabel className="mt-1 m-1">Search:</CFormLabel>
              <CFormInput
                type="text"
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by DMS or MIS name..."
                style={{ width: '250px' }}
              />
            </div>
          </div>

          {loading && (
            <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
              <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
            </div>
          )}

          <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
            <CTable striped bordered hover className="responsive-table">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Vehicle Type</CTableHeaderCell>
                  <CTableHeaderCell>DMS Name</CTableHeaderCell>
                  <CTableHeaderCell>MIS Name</CTableHeaderCell>
                  <CTableHeaderCell>Remarks</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  {(canUpdate || canDelete) && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {mappings.length === 0 && !loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan={canUpdate || canDelete ? '8' : '7'} className="text-center">
                      {searchTerm ? `No results found for "${searchTerm}"` : 'No mappings available'}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  mappings.map((mapping, index) => {
                    const globalIndex = (pagination.page - 1) * pagination.limit + index + 1;
                    return (
                      <CTableRow key={mapping._id}>
                        <CTableDataCell>{globalIndex}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={mapping.type === 'color' ? 'info' : 'primary'}>
                            {mapping.type === 'color' ? 'Colour' : 'Model'}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          {mapping.vehicle_type ? (
                            <CBadge color={mapping.vehicle_type === 'EV' ? 'success' : 'warning'}>
                              {mapping.vehicle_type}
                            </CBadge>
                          ) : (
                            '—'
                          )}
                        </CTableDataCell>
                        <CTableDataCell>{mapping.dms_name}</CTableDataCell>
                        <CTableDataCell>{mapping.mis_name || '—'}</CTableDataCell>
                        <CTableDataCell>{mapping.remarks || '—'}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={mapping.status === 'active' ? 'success' : 'secondary'}>
                            {mapping.status}
                          </CBadge>
                        </CTableDataCell>
                        {(canUpdate || canDelete) && (
                          <CTableDataCell>
                            <CDropdown alignment="end">
                              <CDropdownToggle
                                size="sm"
                                className="options-dropdown-btn"
                                caret={false}
                              >
                                <CIcon icon={cilSettings} />
                                Options
                              </CDropdownToggle>
                              <CDropdownMenu className="options-dropdown-menu">
                                {canUpdate && (
                                  <CDropdownItem
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => openEditModal(mapping)}
                                  >
                                    <CIcon icon={cilPencil} />
                                    Edit
                                  </CDropdownItem>
                                )}
                                {canDelete && (
                                  <CDropdownItem
                                    className="text-danger"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleDelete(mapping._id)}
                                  >
                                    <CIcon icon={cilTrash} />
                                    Delete
                                  </CDropdownItem>
                                )}
                              </CDropdownMenu>
                            </CDropdown>
                          </CTableDataCell>
                        )}
                      </CTableRow>
                    );
                  })
                )}
              </CTableBody>
            </CTable>
          </div>

          {pagination.total > 0 && (
            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted" style={{ fontSize: '13px' }}>
                  {loading
                    ? 'Loading…'
                    : `Showing ${startRecord}–${endRecord} of ${pagination.total} records`}
                </span>
              </div>

              {pagination.pages > 1 && (
                <CPagination align="center" aria-label="Page navigation">
                  <CPaginationItem
                    aria-label="Previous"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1 || loading}
                  >
                    <CIcon icon={cilChevronLeft} />
                  </CPaginationItem>

                  {displayedPages.map((page) => (
                    <CPaginationItem
                      key={page}
                      onClick={() => handlePageChange(page)}
                      active={pagination.page === page}
                      disabled={loading}
                    >
                      {page}
                    </CPaginationItem>
                  ))}

                  <CPaginationItem
                    aria-label="Next"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages || loading}
                  >
                    <CIcon icon={cilChevronRight} />
                  </CPaginationItem>
                </CPagination>
              )}
            </div>
          )}
        </CCardBody>
      </CCard>

      {/* ============================================================
          Add / Edit Modal
          ============================================================ */}
      <CModal visible={formModalOpen} onClose={resetFormModal}>
        <CModalHeader>
          <CModalTitle>{formMode === 'add' ? 'Add Mapping' : 'Edit Mapping'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {formError && <CAlert color="danger">{formError}</CAlert>}

          <div className="mb-3">
            <CFormLabel>
              Type<span className="required">*</span>
            </CFormLabel>
            <CFormSelect
              value={formType}
              onChange={(e) => handleFormTypeChange(e.target.value)}
              disabled={formMode === 'edit'}
            >
              <option value="color">Colour</option>
              <option value="model">Model</option>
            </CFormSelect>
          </div>

          {/* NOTE: Vehicle Type field has been removed from the form */}

          {/* Show model dropdowns only when type is "model" */}
          {formType === 'model' && (
            <>
              <div className="mb-3">
                <CFormLabel>MIS Vehicle Model</CFormLabel>
                <Select
                  classNamePrefix="react-select"
                  placeholder={
                    misModelsLoading ? 'Loading MIS models...' : '- Select MIS Model -'
                  }
                  isLoading={misModelsLoading}
                  isClearable
                  options={misModelOptions}
                  value={selectedMisOption}
                  onChange={handleMisModelSelect}
                />
                <small className="text-muted">All MIS models (not filtered by vehicle type)</small>
              </div>

              <div className="mb-3">
                <CFormLabel>
                  DMS Vehicle Model<span className="required">*</span>
                </CFormLabel>
                <Select
                  classNamePrefix="react-select"
                  placeholder={
                    dmsModelsLoading ? 'Loading DMS models...' : '- Select DMS Model -'
                  }
                  isLoading={dmsModelsLoading}
                  isClearable
                  options={dmsModelOptions}
                  value={selectedDmsOption}
                  onChange={handleDmsModelSelect}
                  noOptionsMessage={() => dmsModelsError || 'No options'}
                />
                <small className={dmsModelsError ? 'text-danger' : 'text-muted'}>
                  {dmsModelsError || 'DMS Models fetched from advantage-approval API'}
                </small>
              </div>
            </>
          )}

          {/* For Color type - show MIS Model + MIS Color + DMS Color */}
          {formType === 'color' && (
            <>
              <div className="mb-3">
                <CFormLabel>
                  MIS Vehicle Model<span className="required">*</span>
                </CFormLabel>
                <Select
                  classNamePrefix="react-select"
                  placeholder={
                    misModelsLoading ? 'Loading MIS models...' : '- Select MIS Model -'
                  }
                  isLoading={misModelsLoading}
                  isClearable
                  options={misModelOptions}
                  value={selectedMisOption}
                  onChange={handleMisModelSelect}
                />
                <small className="text-muted">Select a model to load its colors</small>
              </div>

              <div className="mb-3">
                <CFormLabel>
                  MIS Vehicle Colour<span className="required">*</span>
                </CFormLabel>
                <Select
                  classNamePrefix="react-select"
                  placeholder={
                    colorOptionsLoading
                      ? 'Loading colors...'
                      : selectedMisModelForColor
                      ? '- Select MIS Color -'
                      : 'Select MIS model first'
                  }
                  isLoading={colorOptionsLoading}
                  isClearable
                  options={colorOptions}
                  value={colorOptions.find((opt) => opt.label === formMisName) || null}
                  onChange={(selectedOption) => {
                    setFormMisName(selectedOption ? selectedOption.label : '');
                  }}
                  noOptionsMessage={() => {
                    if (!selectedMisModelForColor) return 'Select a MIS model first';
                    if (colorOptions.length === 0) return 'No colors available for this model';
                    return 'No options';
                  }}
                  isDisabled={!selectedMisModelForColor}
                />
                <small className="text-muted">
                  {selectedMisModelForColor
                    ? `Colors fetched from /colors/model/${selectedMisModelForColor}`
                    : 'Select a MIS model to load colors'}
                </small>
              </div>

              <div className="mb-3">
                <CFormLabel>
                  DMS Vehicle Colour<span className="required">*</span>
                </CFormLabel>
                <CFormInput
                  value={formDmsName}
                  onChange={(e) => setFormDmsName(e.target.value)}
                  placeholder="e.g. IQUBE ST-PEARL WHITE"
                  autoComplete="off"
                />
              </div>
            </>
          )}

          <div className="mb-3">
            <CFormLabel>Remarks</CFormLabel>
            <CFormTextarea
              value={formRemarks}
              onChange={(e) => setFormRemarks(e.target.value)}
              rows={2}
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={resetFormModal} disabled={formLoading}>
            Cancel
          </CButton>
          <CButton className="submit-button" onClick={handleFormSubmit} disabled={formLoading}>
            {formLoading ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* ============================================================
          Export Modal
          ============================================================ */}
      <CModal visible={exportModalOpen} onClose={() => setExportModalOpen(false)}>
        <CModalHeader>
          <CModalTitle>Export Excel</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CFormLabel>Type:</CFormLabel>
            <CFormSelect value={exportType} onChange={(e) => setExportType(e.target.value)}>
              <option value="color">Colour</option>
              <option value="model">Model</option>
            </CFormSelect>
          </div>

          <div className="mb-3">
            <CFormLabel>
              Vehicle Type<span className="required">*</span>
            </CFormLabel>
            <CFormSelect
              value={exportVehicleType}
              onChange={(e) => setExportVehicleType(e.target.value)}
            >
              <option value="EV">EV</option>
              <option value="ICE">ICE</option>
            </CFormSelect>
            <small className="text-muted">
              The export always covers one vehicle type at a time.
            </small>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton className="submit-button" onClick={handleExport} disabled={exportLoading}>
            {exportLoading ? 'Exporting...' : 'Export'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* ============================================================
          Import Modal
          ============================================================ */}
      <CModal visible={importModalOpen} onClose={resetImportModal}>
        <CModalHeader>
          <CModalTitle>Import Excel</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CFormLabel>Type:</CFormLabel>
            <CFormSelect value={importType} onChange={(e) => setImportType(e.target.value)}>
              <option value="color">Colour</option>
              <option value="model">Model</option>
            </CFormSelect>
          </div>

          <div className="mb-3">
            <CFormLabel>Vehicle Type:</CFormLabel>
            <CFormSelect
              value={importVehicleType}
              onChange={(e) => setImportVehicleType(e.target.value)}
            >
              <option value="EV">EV</option>
              <option value="ICE">ICE</option>
            </CFormSelect>
          </div>

          <div className="mb-3">
            <CFormLabel>Select Excel/CSV File:</CFormLabel>
            <CFormInput
              type="file"
              id="advance-mapping-import-file"
              accept=".xlsx,.xls,.csv"
              onChange={handleImportFileChange}
            />
            <small className="text-muted">Supported formats: .xlsx, .xls, .csv</small>
          </div>

          {importFile && (
            <CAlert color="info">
              Selected file: {importFile.name} ({(importFile.size / 1024).toFixed(2)} KB)
            </CAlert>
          )}

          {importResult && (
            <CAlert color={importResult.status === 'success' ? 'success' : 'warning'}>
              <div className="d-flex align-items-center mb-2">
                <CIcon
                  icon={importResult.status === 'success' ? cilCheckCircle : cilWarning}
                  className="me-2"
                />
                {importResult.message}
              </div>
              {importResult.summary && (
                <ul className="mb-0">
                  <li>Total rows: {importResult.summary.totalRows}</li>
                  <li>Created: {importResult.summary.created}</li>
                  <li>Updated: {importResult.summary.updated}</li>
                  <li>Skipped: {importResult.summary.skipped}</li>
                </ul>
              )}
            </CAlert>
          )}

          {importError && <CAlert color="danger">{importError}</CAlert>}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={resetImportModal} disabled={importLoading}>
            Close
          </CButton>
          <CButton
            className="submit-button"
            onClick={handleImport}
            disabled={!importFile || importLoading}
          >
            {importLoading ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Importing...
              </>
            ) : (
              'Import'
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default AdvantageModelMapping;