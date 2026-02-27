import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '../components/ui/Button'
import { Card, CardBody } from '../components/ui/Card'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { CustomerFormModal } from '../components/customers/CustomerFormModal'
import { useCustomerForm, EMPTY_CUSTOMER_FORM, mapCustomerToForm } from '../hooks/useCustomerForm'
import { validateCustomerPayload } from '../validation/customerSchema'
import { Input } from '../components/ui/Input'
import { Search, Pencil, Trash2, Users, UserPlus, MapPin } from 'lucide-react'

function CustomersPage() {
    const [customers, setCustomers] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [editingCustomer, setEditingCustomer] = useState(null)
    const { formData, formErrors, setFieldValue, setFormErrors, resetForm } = useCustomerForm()
    const [confirmDeleteId, setConfirmDeleteId] = useState(null)

    useEffect(() => {
        loadCustomers()
    }, [])

    const loadCustomers = async () => {
        try {
            if (window.electronAPI) {
                const result = await window.electronAPI.customers.getAll()
                setCustomers(result || [])
            }
        } catch (error) {
            console.error('Error loading customers:', error)
            toast.error('Erreur lors du chargement des clients')
        }
    }

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.address && c.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.city && c.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.account_number && c.account_number.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.agency && c.agency.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const openAddModal = () => {
        setEditingCustomer(null)
        resetForm(EMPTY_CUSTOMER_FORM)
        setShowModal(true)
    }

    const openEditModal = (customer) => {
        setEditingCustomer(customer)
        resetForm(mapCustomerToForm(customer))
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setEditingCustomer(null)
        resetForm(EMPTY_CUSTOMER_FORM)
    }

    const handleInputChange = (field) => (e) => {
        setFieldValue(field, e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const validation = validateCustomerPayload(formData)
        if (!validation.success) {
            setFormErrors({ [validation.field]: validation.message })
            toast.error(validation.message)
            return
        }

        setIsSubmitting(true)
        try {
            if (window.electronAPI) {
                const payload = validation.data
                if (editingCustomer) {
                    await window.electronAPI.customers.update({
                        id: editingCustomer.id,
                        ...payload
                    })
                    toast.success('Client modifié avec succès')
                } else {
                    await window.electronAPI.customers.add(payload)
                    toast.success('Client ajouté avec succès')
                }
                await loadCustomers()
                closeModal()
            }
        } catch (error) {
            console.error('Error saving customer:', error)
            toast.error("Erreur lors de l'enregistrement")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id) => {
        setConfirmDeleteId(id)
    }

    const confirmDelete = async () => {
        try {
            if (window.electronAPI) {
                await window.electronAPI.customers.delete(confirmDeleteId)
                await loadCustomers()
                toast.success('Client supprimé')
            }
        } catch (error) {
            console.error('Error deleting customer:', error)
            toast.error('Erreur lors de la suppression')
        }
        setConfirmDeleteId(null)
    }

    return (
        <>
            <header className="page-header">
                <div>
                    <h1 className="page-title">Base de Données Clients</h1>
                    <p className="page-subtitle">{customers.length} client{customers.length !== 1 ? 's' : ''} enregistré{customers.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="page-actions">
                    <Button onClick={openAddModal}>
                        <UserPlus size={16} /> Ajouter un client
                    </Button>
                </div>
            </header>

            <div className="page-body">
                {/* Search Bar */}
                <Card className="mb-6">
                    <CardBody className="!py-3">
                        <Input
                            icon={<Search size={16} />}
                            placeholder="Rechercher par nom, adresse, compte, agence ou ville..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            containerClassName="mb-0"
                        />
                    </CardBody>
                </Card>

                {/* Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon"><Users size={40} /></div>
                        <div className="stat-label">Total clients</div>
                        <div className="stat-value">{customers.length}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><Search size={40} /></div>
                        <div className="stat-label">Résultats de recherche</div>
                        <div className="stat-value">{filteredCustomers.length}</div>
                    </div>
                </div>

                {/* Table */}
                <Card>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Adresse</th>
                                    <th>Compte N°</th>
                                    <th>Agence</th>
                                    <th>Ville</th>
                                    <th>Informations</th>
                                    <th style={{ width: '120px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.length === 0 ? (
                                    <tr>
                                        <td colSpan="7">
                                            <div className="empty-state">
                                                <div className="empty-state-icon">
                                                    <Users size={28} />
                                                </div>
                                                <p className="empty-state-title">
                                                    {customers.length === 0 ? 'Aucun client enregistré' : 'Aucun résultat'}
                                                </p>
                                                <p className="empty-state-desc">
                                                    {customers.length === 0
                                                        ? 'Cliquez sur "Ajouter un client" pour commencer.'
                                                        : 'Essayez avec d\'autres termes de recherche.'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCustomers.map((customer) => (
                                        <tr key={customer.id}>
                                            <td>
                                                <span className="font-semibold text-slate-800 dark:text-slate-200">{customer.name}</span>
                                            </td>
                                            <td className="text-slate-500 dark:text-slate-400">{customer.address || '—'}</td>
                                            <td className="font-mono text-slate-600 dark:text-slate-300">{customer.account_number || '—'}</td>
                                            <td className="text-slate-600 dark:text-slate-300">{customer.agency || '—'}</td>
                                            <td>
                                                {customer.city ? (
                                                    <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300">
                                                        <MapPin size={12} className="text-slate-400" />
                                                        {customer.city}
                                                    </span>
                                                ) : '—'}
                                            </td>
                                            <td className="text-muted text-sm">{customer.additional_info || '—'}</td>
                                            <td>
                                                <div className="table-actions">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openEditModal(customer)}
                                                        title="Modifier"
                                                    >
                                                        <Pencil size={14} />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-danger hover:!bg-red-50 dark:hover:!bg-red-900/20"
                                                        onClick={() => handleDelete(customer.id)}
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            <CustomerFormModal
                isOpen={showModal}
                isSubmitting={isSubmitting}
                isEditing={Boolean(editingCustomer)}
                formData={formData}
                formErrors={formErrors}
                onClose={closeModal}
                onSubmit={handleSubmit}
                onFieldChange={handleInputChange}
            />

            <ConfirmModal
                isOpen={confirmDeleteId !== null}
                onClose={() => setConfirmDeleteId(null)}
                onConfirm={confirmDelete}
                title="Supprimer le client"
                message="Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible."
                confirmText="Supprimer"
            />
        </>
    )
}

export default CustomersPage
