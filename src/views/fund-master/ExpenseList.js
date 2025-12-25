import '../../css/table.css';
import {
  React,
  useState,
  useEffect,
  Menu,
  MenuItem,
  getDefaultSearchFields,
  useTableFilter,
  usePagination,
  confirmDelete,
  showError,
  axiosInstance
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
  CAlert
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilSettings, cilPencil, cilTrash } from '@coreui/icons';
import AddExpense from './AddExpense';
import { useAuth } from '../../context/AuthContext';
import { 
  canViewPage,
  canCreateInPage,
  canUpdateInPage,
  canDeleteInPage,
  MODULES,
  PAGES 
} from '../../utils/modulePermissions';

const ExpenseList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const { currentRecords, PaginationOptions } = usePagination(filteredData || []);
  const { permissions } = useAuth();
  
  // Page-level permission checks for Expense Master page under Fund Master module
  const canViewExpense = canViewPage(permissions, MODULES.FUND_MASTER, PAGES.FUND_MASTER.EXPENSE_MASTER);
  const canCreateExpense = canCreateInPage(permissions, MODULES.FUND_MASTER, PAGES.FUND_MASTER.EXPENSE_MASTER);
  const canUpdateExpense = canUpdateInPage(permissions, MODULES.FUND_MASTER, PAGES.FUND_MASTER.EXPENSE_MASTER);
  const canDeleteExpense = canDeleteInPage(permissions, MODULES.FUND_MASTER, PAGES.FUND_MASTER.EXPENSE_MASTER);
  
  const showActionColumn = canUpdateExpense || canDeleteExpense;

  useEffect(() => {
    if (!canViewExpense) {
      showError('You do not have permission to view Expense Master');
      return;
    }
    
    fetchData();
  }, [canViewExpense]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/expense-accounts');
      setData(response.data.data.expenseAccounts || []);
      setFilteredData(response.data.data.expenseAccounts || []);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const handleDelete = async (id) => {
    if (!canDeleteExpense) {
      showError('You do not have permission to delete expense account');
      return;
    }
    
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/expense-accounts/${id}`);
        setData(data.filter((expense) => expense.id !== id));
        fetchData();
        setSuccessMessage('Expense deleted successfully');
        setTimeout(() => setSuccessMessage(''), 1500);
      } catch (error) {
        console.log(error);
        showError(error);
      }
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    handleFilter(value, getDefaultSearchFields('expense'));
  };

  const handleShowAddModal = () => {
    if (!canCreateExpense) {
      showError('You do not have permission to add expense account');
      return;
    }
    
    setEditingExpense(null);
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingExpense(null);
  };

  const handleExpenseSaved = (message) => {
    fetchData();
    handleCloseModal();
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 1500);
  };

  if (!canViewExpense) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Expense Master.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
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
      <div className='title'>Expense Account Master</div>
      
      {successMessage && (
        <CAlert color="success" className="mb-3">
          {successMessage}
        </CAlert>
      )}
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {canCreateExpense && (
              <CButton 
                size="sm" 
                className="action-btn me-1"
                onClick={handleShowAddModal}
                disabled={!canCreateExpense}
              >
                <CIcon icon={cilPlus} className='icon'/> New
              </CButton>
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
                disabled={!canViewExpense}
              />
            </div>
          </div>
          
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {!currentRecords?.length ? (
                  <CTableRow>
                    <CTableDataCell colSpan={showActionColumn ? "3" : "2"} className="text-center">
                      <CBadge color="secondary">No expenses available</CBadge>
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  currentRecords.map((expense, index) => (
                    <CTableRow key={expense.id || index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{expense.name}</CTableDataCell>
                      {showActionColumn && (
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            className='option-button btn-sm'
                            onClick={(event) => handleClick(event, expense.id)}
                            disabled={!canUpdateExpense && !canDeleteExpense}
                          >
                            <CIcon icon={cilSettings} />
                            Options
                          </CButton>
                          <Menu 
                            id={`action-menu-${expense.id}`} 
                            anchorEl={anchorEl} 
                            open={menuId === expense.id} 
                            onClose={handleClose}
                          >
                            {/* {canUpdateExpense && (
                              <MenuItem 
                                onClick={() => handleShowEditModal(expense)}
                                style={{ color: 'black' }}
                              >
                                <CIcon icon={cilPencil} className="me-2" />
                                Edit
                              </MenuItem>
                            )} */}
                            {canDeleteExpense && (
                              <MenuItem onClick={() => handleDelete(expense.id)}>
                                <CIcon icon={cilTrash} className="me-2" />
                                Delete
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

      <AddExpense
        show={showModal}
        onClose={handleCloseModal}
        onExpenseSaved={handleExpenseSaved}
        editingExpense={editingExpense}
      />
    </div>
  );
};

export default ExpenseList;