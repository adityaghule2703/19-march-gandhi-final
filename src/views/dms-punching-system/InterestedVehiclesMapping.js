import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CSpinner,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert,
  CPagination,
  CPaginationItem,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilPlus,
  cilPencil,
  cilTrash,
  cilSearch,
  cilChevronLeft,
  cilChevronRight,
} from '@coreui/icons';
import axiosInstance from '../../axiosInstance';
import '../../css/table.css';
import '../../css/form.css';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_LIMIT = 25;

const emptyForm = () => ({
  model_name: '',
  compatible_name: '',
  status: 'active',
});

const InterestedVehiclesMapping = () => {
  // ── List state ───────────────────────────────────────────────────────────
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // ── Modal state ──────────────────────────────────────────────────────────
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // ── Delete state ─────────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Debounce timer for search
  const searchTimer = useRef(null);

  // ── Fetch list ───────────────────────────────────────────────────────────
  const fetchList = useCallback(
    async (targetPage = page, targetLimit = limit, targetSearch = search) => {
      setLoading(true);
      setError('');
      try {
        const params = { page: targetPage, limit: targetLimit };
        if (targetSearch.trim()) params.search = targetSearch.trim();

        const res = await axiosInstance.get('/model-name-masters', { params });
        const data = res.data?.data || {};

        setRows(data.modelNameMasters || []);
        setTotal(res.data?.total ?? data.modelNameMasters?.length ?? 0);
        setPage(res.data?.page ?? targetPage);
        setPages(res.data?.pages ?? 1);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to load model name masters'
        );
      } finally {
        setLoading(false);
      }
    },
    [page, limit, search]
  );

  useEffect(() => {
    fetchList(1, limit, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Debounced search ─────────────────────────────────────────────────────
  const handleSearchChange = (value) => {
    setSearch(value);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      fetchList(1, limit, value);
    }, 500);
  };

  // ── Limit / page handlers ────────────────────────────────────────────────
  const handleLimitChange = (newLimit) => {
    const l = parseInt(newLimit, 10);
    setLimit(l);
    fetchList(1, l, search);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pages) return;
    fetchList(newPage, limit, search);
  };

  // ── Open modals ──────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setFormErrors({});
    setShowModal(true);
  };

  const openEdit = (row) => {
    setEditingId(row._id);
    setForm({
      model_name: row.model_name || '',
      compatible_name: row.compatible_name || '',
      status: row.status || 'active',
    });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;
    setShowModal(false);
  };

  // ── Validation ───────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!form.model_name.trim()) errs.model_name = 'Model name is required';
    if (!form.compatible_name.trim())
      errs.compatible_name = 'Compatible name is required';
    if (!form.status) errs.status = 'Status is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Save (create / update) ───────────────────────────────────────────────
  const handleSave = async () => {
    if (!validate()) return;

    const payload = {
      model_name: form.model_name.trim(),
      compatible_name: form.compatible_name.trim(),
      status: form.status,
    };

    try {
      setSaving(true);
      setError('');
      if (editingId) {
        await axiosInstance.put(`/model-name-masters/${editingId}`, payload);
        setSuccessMsg('Model name master updated successfully');
      } else {
        await axiosInstance.post('/model-name-masters', payload);
        setSuccessMsg('Model name master created successfully');
      }
      setShowModal(false);
      fetchList(editingId ? page : 1, limit, search);
    } catch (err) {
      const data = err.response?.data || {};
      const msg =
        data.message ||
        data.error ||
        (Array.isArray(data.errors) && data.errors[0]?.msg) ||
        err.message ||
        'Failed to save model name master';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      setError('');
      await axiosInstance.delete(`/model-name-masters/${deleteTarget._id}`);
      setSuccessMsg('Model name master deleted successfully');
      setDeleteTarget(null);
      fetchList(page, limit, search);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to delete model name master'
      );
    } finally {
      setDeleting(false);
    }
  };

  // ── Derived UI helpers ───────────────────────────────────────────────────
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const pageNums = (() => {
    let sp = Math.max(1, page - 2);
    let ep = Math.min(pages, page + 2);
    if (page <= 3) ep = Math.min(5, pages);
    if (page >= pages - 2) sp = Math.max(1, pages - 4);
    const out = [];
    for (let i = sp; i <= ep; i++) out.push(i);
    return out;
  })();

  return (
    <div>
      <div className="title">Interested Vehicles Mapping</div>

      {error && (
        <CAlert color="danger" className="mb-3" dismissible onClose={() => setError('')}>
          {error}
        </CAlert>
      )}
      {successMsg && (
        <CAlert
          color="success"
          className="mb-3"
          dismissible
          onClose={() => setSuccessMsg('')}
        >
          {successMsg}
        </CAlert>
      )}

      <CCard className="table-container mt-4">
        <CCardHeader className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <CButton className="action-btn me-1" size="sm" onClick={openCreate}>
              <CIcon icon={cilPlus} className="icon" /> Add Mapping
            </CButton>
          </div>
          <div className="d-flex align-items-center gap-2">
            <CFormLabel className="mb-0 text-nowrap" style={{ fontSize: '14px' }}>
              Search:
            </CFormLabel>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by model or compatible name..."
              className="square-search"
              style={{
                maxWidth: '320px',
                height: '30px',
                borderRadius: '0',
                border: '1px solid #ced4da',
                padding: '0 8px',
                outline: 'none',
                fontSize: '14px',
              }}
              autoComplete="off"
            />
          </div>
        </CCardHeader>

        <CCardBody>
          {loading && rows.length === 0 ? (
            <div className="d-flex justify-content-center py-5">
              <CSpinner color="primary" />
            </div>
          ) : (
            <>
              <div className="responsive-table-wrapper">
                <CTable striped bordered hover className="responsive-table">
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Sr.no</CTableHeaderCell>
                      <CTableHeaderCell>Model Name</CTableHeaderCell>
                      <CTableHeaderCell>Compatible Name</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Created By</CTableHeaderCell>
                      <CTableHeaderCell>Created At</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {rows.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan={7} className="text-center text-danger">
                          {search ? `No results found for "${search}"` : 'No mappings available'}
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      rows.map((row, i) => (
                        <CTableRow key={row._id}>
                          <CTableDataCell>{(page - 1) * limit + i + 1}</CTableDataCell>
                          <CTableDataCell>{row.model_name}</CTableDataCell>
                          <CTableDataCell>{row.compatible_name}</CTableDataCell>
                          <CTableDataCell>
                            <span
                              className="status-badge"
                              style={{
                                backgroundColor:
                                  row.status === 'active' ? '#198754' : '#6c757d',
                                color: '#fff',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '500',
                              }}
                            >
                              {row.status}
                            </span>
                          </CTableDataCell>
                          <CTableDataCell>{row.created_by?.name || 'N/A'}</CTableDataCell>
                          <CTableDataCell>
                            {row.created_at
                              ? new Date(row.created_at).toLocaleDateString('en-GB')
                              : 'N/A'}
                          </CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex gap-2">
                              <CButton
                                size="sm"
                                className="upload-kyc-btn icon-only"
                                onClick={() => openEdit(row)}
                                title="Edit"
                              >
                                <CIcon icon={cilPencil} />
                              </CButton>
                              <CButton
                                size="sm"
                                color="danger"
                                className="icon-only"
                                onClick={() => setDeleteTarget(row)}
                                title="Delete"
                              >
                                <CIcon icon={cilTrash} />
                              </CButton>
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    )}
                  </CTableBody>
                </CTable>
              </div>

              {/* Pagination */}
              <div className="mt-3 border-top pt-3">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <CFormLabel
                      className="mb-0 text-muted"
                      style={{ fontSize: '13px' }}
                    >
                      Rows per page:
                    </CFormLabel>
                    <CFormSelect
                      value={limit}
                      onChange={(e) => handleLimitChange(e.target.value)}
                      style={{ width: '80px', height: '32px', fontSize: '13px' }}
                      size="sm"
                      disabled={loading}
                    >
                      {PAGE_SIZE_OPTIONS.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </CFormSelect>
                  </div>
                  <span className="text-muted" style={{ fontSize: '13px' }}>
                    {loading
                      ? 'Loading…'
                      : total === 0
                      ? 'No records'
                      : `Showing ${start}–${end} of ${total} records`}
                  </span>
                </div>
                {pages > 1 && (
                  <CPagination align="center" size="sm">
                    <CPaginationItem
                      onClick={() => handlePageChange(1)}
                      disabled={page === 1 || loading}
                    >
                      «
                    </CPaginationItem>
                    <CPaginationItem
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1 || loading}
                    >
                      <CIcon icon={cilChevronLeft} />
                    </CPaginationItem>
                    {pageNums.map((p) => (
                      <CPaginationItem
                        key={p}
                        active={p === page}
                        onClick={() => handlePageChange(p)}
                        disabled={loading}
                      >
                        {p}
                      </CPaginationItem>
                    ))}
                    <CPaginationItem
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === pages || loading}
                    >
                      <CIcon icon={cilChevronRight} />
                    </CPaginationItem>
                    <CPaginationItem
                      onClick={() => handlePageChange(pages)}
                      disabled={page === pages || loading}
                    >
                      »
                    </CPaginationItem>
                  </CPagination>
                )}
              </div>
            </>
          )}
        </CCardBody>
      </CCard>

      {/* ── Create / Edit Modal ─────────────────────────────────────────── */}
      <CModal visible={showModal} onClose={closeModal} alignment="center">
        <CModalHeader>
          <CModalTitle>
            {editingId ? 'Edit Model Name Master' : 'Add Model Name Master'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CFormLabel htmlFor="model_name">
              Model Name <span className="required">*</span>
            </CFormLabel>
            <CFormInput
              id="model_name"
              value={form.model_name}
              onChange={(e) => {
                setForm({ ...form, model_name: e.target.value });
                if (formErrors.model_name)
                  setFormErrors({ ...formErrors, model_name: '' });
              }}
              placeholder="e.g. TVS Sport ES+ OBD IIB"
            />
            {formErrors.model_name && (
              <small className="text-danger">{formErrors.model_name}</small>
            )}
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="compatible_name">
              Compatible Name <span className="required">*</span>
            </CFormLabel>
            <CFormInput
              id="compatible_name"
              value={form.compatible_name}
              onChange={(e) => {
                setForm({ ...form, compatible_name: e.target.value });
                if (formErrors.compatible_name)
                  setFormErrors({ ...formErrors, compatible_name: '' });
              }}
              placeholder="e.g. TVS Sport ES Plus OBD IIB"
            />
            {formErrors.compatible_name && (
              <small className="text-danger">{formErrors.compatible_name}</small>
            )}
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="status">
              Status <span className="required">*</span>
            </CFormLabel>
            <CFormSelect
              id="status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </CFormSelect>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={closeModal} disabled={saving}>
            Cancel
          </CButton>
          <CButton className="submit-button" onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Saving…
              </>
            ) : editingId ? (
              'Update'
            ) : (
              'Create'
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* ── Delete Confirm Modal ────────────────────────────────────────── */}
      <CModal
        visible={!!deleteTarget}
        onClose={() => (deleting ? null : setDeleteTarget(null))}
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle>Delete Model Name Master</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete{' '}
          <strong>{deleteTarget?.model_name}</strong>? This action cannot be undone.
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => setDeleteTarget(null)}
            disabled={deleting}
          >
            Cancel
          </CButton>
          <CButton color="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Deleting…
              </>
            ) : (
              'Delete'
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default InterestedVehiclesMapping;