import '../../css/table.css';
import {
  React,
  useState,
  useEffect,
  Link,
  Menu,
  MenuItem,
  getDefaultSearchFields,
  useTableFilter,
  usePagination,
  confirmDelete,
  showError,
  showSuccess,
  axiosInstance
} from '../../utils/tableImports';
import '../../css/importCsv.css';
import '../../css/form.css';
import ImportInwardCSV from '../../views/csv/ImportInwardCSV';
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
  CFormTextarea
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilSearch, cilSettings, cilPencil, cilTrash, cilCloudDownload, cilZoomOut, cilLockUnlocked, cilShare, cilPrint } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import config from '../../config';
import { useAuth } from '../../context/AuthContext';
import AllocateVehicleModal from './AllocateVehicleModal';

const StockList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const { currentRecords, PaginationOptions } = usePagination(filteredData);
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [filterBranchId, setFilterBranchId] = useState('');
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const [unblockModalOpen, setUnblockModalOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [unblockReason, setUnblockReason] = useState('');
  const [unblockLoading, setUnblockLoading] = useState(false);
  const [allocateModalOpen, setAllocateModalOpen] = useState(false);
  const [selectedVehicleForAllocation, setSelectedVehicleForAllocation] = useState(null);
  const [vehicleAllocationDetails, setVehicleAllocationDetails] = useState(null);

  const { permissions = [] } = useAuth();
  const navigate = useNavigate();

  // Page-level permission checks for Inward Stock page under Purchase module
  const hasInwardStockView = hasSafePagePermission(
    permissions, 
    MODULES.PURCHASE, 
    PAGES.PURCHASE.INWARD_STOCK, 
    ACTIONS.VIEW
  );
  
  const hasInwardStockCreate = hasSafePagePermission(
    permissions, 
    MODULES.PURCHASE, 
    PAGES.PURCHASE.INWARD_STOCK, 
    ACTIONS.CREATE
  );
  
  const hasInwardStockUpdate = hasSafePagePermission(
    permissions, 
    MODULES.PURCHASE, 
    PAGES.PURCHASE.INWARD_STOCK, 
    ACTIONS.UPDATE
  );
  
  const hasInwardStockDelete = hasSafePagePermission(
    permissions, 
    MODULES.PURCHASE, 
    PAGES.PURCHASE.INWARD_STOCK, 
    ACTIONS.DELETE
  );

  // Using convenience functions for cleaner code
  const canViewInwardStock = canViewPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.INWARD_STOCK);
  const canCreateInwardStock = canCreateInPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.INWARD_STOCK);
  const canUpdateInwardStock = canUpdateInPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.INWARD_STOCK);
  const canDeleteInwardStock = canDeleteInPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.INWARD_STOCK);
  
  // For export, you might need a specific permission or use CREATE permission
  const canExportInwardStock = hasInwardStockCreate || canCreateInwardStock;

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const branchId = storedUser.branch?._id;
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    if (!canViewInwardStock) {
      showError('You do not have permission to view Inward Stock');
      navigate('/dashboard');
      return;
    }
    
    fetchData();
    fetchBranches();
  }, []);

  const fetchData = async (type = '', branchId = '') => {
    try {
      setLoading(true);
      let url = '/vehicles';
      if (type && branchId) {
        url += `?type=${type}&location=${branchId}`;
      }

      const response = await axiosInstance.get(url);
      const nonSoldVehicles = response.data.data.vehicles.filter(
        (vehicle) => vehicle.status !== 'sold' && vehicle.status !== 'Sold' && vehicle.status !== 'SOLD'
      );

      setData(nonSoldVehicles);
      setFilteredData(nonSoldVehicles);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axiosInstance.get('/branches');
      setBranches(response.data.data || []);
    } catch (error) {
      console.log('Error fetching branches', error);
    }
  };

  const handlePrintQR = (vehicle) => {
    if (!canViewInwardStock) {
      showError('You do not have permission to view Inward Stock');
      return;
    }
    
    const qrUrl = vehicle.qrCode
      ? `${config.baseURL || ''}${vehicle.qrCode}`
      : '';
  
    const printWindow = window.open('', '_blank', 'width=400,height=500');
  
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center,
              padding: 20px,
            }
            .qr-container {
              border: 1px solid #000,
              padding: 15px,
              width: 400px,
              margin: auto,
            }
            img {
              width: 250px,
              height: 250px,
              margin-bottom: 10px,
            }
            .label {
              font-weight: bold,
              margin-top: 8px,
            }
            .value {
              margin-bottom: 6px,
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            ${qrUrl ? `<img src="${qrUrl}" />` : '<p>No QR Available</p>'}
  
            <div class="label">Chassis Number</div>
            <div class="value">${vehicle.chassisNumber || '-'}</div>
  
            <div class="label">Model Name</div>
            <div class="value">${vehicle.modelName || '-'}</div>
  
            <div class="label">Key Number</div>
            <div class="value">${vehicle.keyNumber || '-'}</div>
          </div>
  
          <script>
            window.onload = function () {
              window.print();
              window.onafterprint = window.close;
            }
          </script>
        </body>
      </html>
    `);
  
    printWindow.document.close();
  };

  const handleClick = (event, id) => {
    if (!canViewInwardStock && !canUpdateInwardStock && !canDeleteInwardStock) {
      showError('You do not have permission to access this menu');
      return;
    }
    
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const handleUnblockClick = (vehicleId) => {
    if (!canUpdateInwardStock) {
      showError('You do not have permission to unblock vehicles');
      return;
    }
    setSelectedVehicleId(vehicleId);
    setUnblockModalOpen(true);
    handleClose();
  };

  const handleUnblockSubmit = async () => {
    if (!canUpdateInwardStock) {
      showError('You do not have permission to unblock vehicles');
      return;
    }

    if (!unblockReason.trim()) {
      showError('Please enter a reason for unblocking');
      return;
    }

    setUnblockLoading(true);
    try {
      await axiosInstance.put(
        `/vehicles/unblock-and-assign/${selectedVehicleId}`,
        {
          reason: unblockReason
        }
      );
      
      showSuccess('Vehicle unblocked successfully!');

      setUnblockReason('');
      setUnblockModalOpen(false);
      setSelectedVehicleId(null);
      fetchData();
    } catch (error) {
      console.error('Error unblocking vehicle:', error);
      showError(error.response?.data?.message || 'Failed to unblock vehicle');
    } finally {
      setUnblockLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!canDeleteInwardStock) {
      showError('You do not have permission to delete vehicles');
      return;
    }

    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/vehicles/${id}`);
        setData(data.filter((vehicle) => vehicle.id !== id));
        fetchData();
        showSuccess();
      } catch (error) {
        console.log(error);
        showError(error);
      }
    }
  };

  const handleImportSuccess = () => {
    if (!canCreateInwardStock) {
      showError('You do not have permission to import vehicles');
      return;
    }
    fetchData();
  };

  const applyFilter = () => {
    if (filterType && filterBranchId) {
      fetchData(filterType, filterBranchId);
      setIsFilterApplied(true);
      setFilterModalOpen(false);
    } else {
      showError('Please select both type and branch to apply filter');
    }
  };

  const clearFilter = () => {
    setFilterType('');
    setFilterBranchId('');
    setIsFilterApplied(false);
    fetchData();
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    handleFilter(value, getDefaultSearchFields('inward'));
  };

  const addNewStock = () => {
    if (!canCreateInwardStock) {
      showError('You do not have permission to add new stock');
      return;
    }
    navigate('/inward-stock');
  };

  const handleExportExcel = async () => {
    if (!canExportInwardStock) {
      showError('You do not have permission to export data');
      return;
    }

    if (!selectedType) {
      showError('Please select a type.');
      return;
    }
    if (!selectedBranchId) {
      showError('Please select a branch.');
      return;
    }

    setExportLoading(true);
    try {
      const response = await axiosInstance.get(
        `/vehicles/export-excel?&type=${selectedType}&branch_id=${selectedBranchId}`,
        {
          responseType: 'blob'
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `exported_data_${selectedType}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setCsvDialogOpen(false);
      setSelectedType('');
      setSelectedBranchId('');
      showSuccess('Excel exported successfully!');
    } catch (error) {
      console.error('Excel export failed:', error);
      showError('Failed to export Excel.');
    } finally {
      setExportLoading(false);
    }
  };

  const resetExportModal = () => {
    setSelectedType('');
    setSelectedBranchId('');
    setCsvDialogOpen(false);
  };

  const resetFilterModal = () => {
    setFilterType('');
    setFilterBranchId('');
    setFilterModalOpen(false);
  };

  const resetUnblockModal = () => {
    setUnblockReason('');
    setSelectedVehicleId(null);
    setUnblockModalOpen(false);
  };

  const isVehicleBlocked = (status) => {
    return status.toLowerCase() === 'blocked';
  };
  
  const isVehicleFriz = (status) => {
    return status.toUpperCase() === 'FROZEN';
  };

  const handleAllocateClick = (vehicle) => {
    if (!canUpdateInwardStock) {
      showError('You do not have permission to allocate vehicles');
      return;
    }

    const extractId = (item) => {
      if (!item) return '';
      if (typeof item === 'object') {
        return item._id || item.id || '';
      }
      return item;
    };

    const vehicleDetails = {
      vehicleId: vehicle._id || vehicle.id,
      modelName: vehicle.modelName || '',
      colorName: vehicle.color?.name || vehicle.color?.id || vehicle.color || '',
      chassisNumber: vehicle.chassisNumber || '',
      locationName: vehicle.unloadLocation?.name || vehicle.subdealerLocation?.name || '',
      modelId: extractId(vehicle.model),
      colorId: extractId(vehicle.color),
      locationId: extractId(vehicle.unloadLocation || vehicle.subdealerLocation)
    };
    
    console.log('Vehicle details for allocation:', vehicleDetails);
    
    setVehicleAllocationDetails(vehicleDetails);
    setSelectedVehicleForAllocation(vehicle._id || vehicle.id);
    setAllocateModalOpen(true);
    handleClose();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  if (!canViewInwardStock) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Inward Stock.
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

  return (
    <div>
      <div className='title'>Inwarded Stock</div>
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {canCreateInwardStock && (
              <CButton 
                size="sm" 
                className="action-btn me-1"
                onClick={addNewStock}
              >
                <CIcon icon={cilPlus} className='icon' /> New Stock
              </CButton>
            )}
            
            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={() => setFilterModalOpen(true)}
            >
              <CIcon icon={cilSearch} className='icon' /> Search
            </CButton>
            
            {isFilterApplied && (
              <CButton 
                size="sm" 
                className="action-btn me-1"
                onClick={clearFilter}
              >
                <CIcon icon={cilZoomOut} className='icon' /> Reset Search
              </CButton>
            )}
           
            {canViewInwardStock && (
              <CButton 
                size="sm" 
                className="action-btn me-1"
                onClick={() => setCsvDialogOpen(true)}
              >
                <CIcon icon={cilCloudDownload} className='icon' /> Export Excel
              </CButton>
            )}

            {canCreateInwardStock && (
              <ImportInwardCSV 
                endpoint="/vehicles/import-excel" 
                onSuccess={handleImportSuccess} 
                buttonText="Import Excel" 
              />
            )}
          </div>
        </CCardHeader>
        
        <CCardBody>
          <div className="d-flex justify-content-between mb-3">
            <div></div>
            <div className='d-flex'>
              <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
              <CFormInput
                type="text"
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Unload Location</CTableHeaderCell>
                  <CTableHeaderCell>Inward Date</CTableHeaderCell>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Vehicle Model</CTableHeaderCell>
                  <CTableHeaderCell>Color</CTableHeaderCell>
                  <CTableHeaderCell>Chassis No</CTableHeaderCell>
                  <CTableHeaderCell>QR Code</CTableHeaderCell>
                  <CTableHeaderCell>Current Status</CTableHeaderCell>
                  {(canUpdateInwardStock || canDeleteInwardStock || canViewInwardStock) && (
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  )}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentRecords.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell 
                      colSpan={(canUpdateInwardStock || canDeleteInwardStock || canViewInwardStock) ? "11" : "10"} 
                      className="text-center"
                    >
                      No inward details available
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  currentRecords.map((vehicle, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{vehicle.unloadLocation?.name || vehicle.subdealerLocation?.name}</CTableDataCell>
                      <CTableDataCell>{new Date(vehicle.createdAt).toLocaleDateString()}</CTableDataCell>
                      <CTableDataCell>{vehicle.type}</CTableDataCell>
                      <CTableDataCell>{vehicle.modelName || ''}</CTableDataCell>
                      <CTableDataCell>{vehicle.color?.name || vehicle.color?.id}</CTableDataCell>
                      <CTableDataCell>{vehicle.chassisNumber}</CTableDataCell>
                      <CTableDataCell>
                        {vehicle.qrCode && (
                          <a
                            href={`${config.baseURL || ''}${vehicle.qrCode}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: 'inline-block' }}
                          >
                            <img
                              src={`${config.baseURL || ''}${vehicle.qrCode}`}
                              alt="QR Code"
                              style={{
                                maxWidth: '100px',
                                maxHeight: '50px',
                                objectFit: 'contain',
                                cursor: 'pointer'
                              }}
                            />
                          </a>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={
                          vehicle.status.toLowerCase() === 'available' ? 'success' :
                          vehicle.status.toLowerCase() === 'blocked' ? 'danger' :
                          'warning'
                        }>
                          {vehicle.status}
                        </CBadge>
                      </CTableDataCell>
                      
                      {(canUpdateInwardStock || canDeleteInwardStock || canViewInwardStock) && (
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            className='option-button btn-sm'
                            onClick={(event) => handleClick(event, vehicle.id)}
                            disabled={!canViewInwardStock && !canUpdateInwardStock && !canDeleteInwardStock}
                          >
                            <CIcon icon={cilSettings} />
                            Options
                          </CButton>
                          <Menu 
                            id={`action-menu-${vehicle.id}`} 
                            anchorEl={anchorEl} 
                            open={menuId === vehicle.id} 
                            onClose={handleClose}
                          >
                            {canUpdateInwardStock && (
                              <Link className="Link" to={`/update-inward/${vehicle.id}`}>
                                <MenuItem style={{ color: 'black' }}>
                                  <CIcon icon={cilPencil} className="me-2" />Edit
                                </MenuItem>
                              </Link>
                            )}
                            
                            {canUpdateInwardStock && isVehicleBlocked(vehicle.status) && (
                              <MenuItem onClick={() => handleUnblockClick(vehicle.id)}>
                                <CIcon icon={cilLockUnlocked} className="me-2" />Unblock
                              </MenuItem>
                            )}
                            
                            {canUpdateInwardStock && isVehicleFriz(vehicle.status) && (
                              <MenuItem onClick={() => handleAllocateClick(vehicle)}>
                                <CIcon icon={cilShare} className="me-2" />Allocate
                              </MenuItem>
                            )}
                            
                            {canDeleteInwardStock && (
                              <MenuItem onClick={() => handleDelete(vehicle.id)}>
                                <CIcon icon={cilTrash} className="me-2" />Delete
                              </MenuItem>
                            )}
                            
                            {canViewInwardStock && (
                              <MenuItem onClick={() => handlePrintQR(vehicle)}>
                                <CIcon icon={cilPrint} className="me-2" />
                                Print QR
                              </MenuItem>
                            )}
                          </Menu>
                        </CTableDataCell>
                      )}
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>

      {/* Unblock Modal */}
      <CModal visible={unblockModalOpen} onClose={resetUnblockModal}>
        <CModalHeader>
          <CModalTitle>Unblock Vehicle</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label className="form-label">Reason for Unblocking<span className='required'>*</span></label>
            <CFormTextarea
              value={unblockReason}
              onChange={(e) => setUnblockReason(e.target.value)}
              rows={3}
              required
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={resetUnblockModal}
            disabled={unblockLoading}
          >
            Cancel
          </CButton>
          <CButton 
            className='submit-button'
            onClick={handleUnblockSubmit}
            disabled={unblockLoading}
          >
            {unblockLoading ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Unblocking...
              </>
            ) : (
              'Unblock Vehicle'
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Filter Modal */}
      <CModal visible={filterModalOpen} onClose={resetFilterModal}>
        <CModalHeader>
          <CModalTitle>Filter Vehicles</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label className="form-label">Type:</label>
            <CFormSelect
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">-- Select Type --</option>
              <option value="EV">EV</option>
              <option value="ICE">ICE</option>
            </CFormSelect>
          </div>

          <div className="mb-3">
            <label className="form-label">Branch:</label>
            <CFormSelect
              value={filterBranchId}
              onChange={(e) => setFilterBranchId(e.target.value)}
            >
              <option value="">-- Select Branch --</option>
              {branches.map((branch) => (
                <option key={branch._id} value={branch._id}>
                  {branch.name}
                </option>
              ))}
            </CFormSelect>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton className='submit-button' onClick={applyFilter}>
            Search
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Export Excel Modal */}
      <CModal visible={csvDialogOpen} onClose={resetExportModal}>
        <CModalHeader>
          <CModalTitle>Export Excel</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label className="form-label">Model Type:</label>
            <CFormSelect
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">-- Select Model Type --</option>
              <option value="EV">EV</option>
              <option value="ICE">ICE</option>
            </CFormSelect>
          </div>

          <div className="mb-3">
            <label className="form-label">Branch:</label>
            <CFormSelect
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
            >
              <option value="">-- Select Branch --</option>
              {branches.map((branch) => (
                <option key={branch._id} value={branch._id}>
                  {branch.name}
                </option>
              ))}
            </CFormSelect>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton 
            className='submit-button' 
            onClick={handleExportExcel}
            disabled={exportLoading}
          >
            {exportLoading ? 'Exporting...' : 'Export'}
          </CButton>
        </CModalFooter>
      </CModal>

      <AllocateVehicleModal
        vehicleId={selectedVehicleForAllocation}
        visible={allocateModalOpen}
        onClose={() => {
          setAllocateModalOpen(false);
          setVehicleAllocationDetails(null);
        }}
        onSuccess={() => {
          fetchData(); 
          setAllocateModalOpen(false);
        }}
        vehicleDetails={vehicleAllocationDetails}
      />
    </div>
  );
};

export default StockList;