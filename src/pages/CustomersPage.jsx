import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '../components/ui/Button'
import { Card, CardBody } from '../components/ui/Card'
import { Input, Textarea } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'

function CustomersPage() {
    const [customers, setCustomers] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [editingCustomer, setEditingCustomer] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        additional_info: ''
    })

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
        (c.city && c.city.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const openAddModal = () => {
        setEditingCustomer(null)
        setFormData({ name: '', address: '', city: '', additional_info: '' })
        setShowModal(true)
    }

    const openEditModal = (customer) => {
        setEditingCustomer(customer)
        setFormData({
            name: customer.name || '',
            address: customer.address || '',
            city: customer.city || '',
            additional_info: customer.additional_info || ''
        })
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setEditingCustomer(null)
        setFormData({ name: '', address: '', city: '', additional_info: '' })
    }

    const handleInputChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.name.trim()) {
            toast.error('Le nom est obligatoire')
            return
        }

        setIsSubmitting(true)
        try {
            if (window.electronAPI) {
                if (editingCustomer) {
                    await window.electronAPI.customers.update({
                        id: editingCustomer.id,
                        ...formData
                    })
                    toast.success('Client modifié avec succès')
                } else {
                    await window.electronAPI.customers.add(formData)
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
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
            return
        }

        try {
            if (window.electronAPI) {
                await window.electronAPI.customers.delete(id)
                await loadCustomers()
                toast.success('Client supprimé')
            }
        } catch (error) {
            console.error('Error deleting customer:', error)
            toast.error('Erreur lors de la suppression')
        }
    }

    return (
        <>
            <header className="page-header">
                <h1 className="page-title">Base de Données Clients</h1>
                <div className="page-actions">
                    <Button onClick={openAddModal}>
                        ➕ Ajouter un client
                    </Button>
                </div>
            </header>

            <div className="page-body">
                {/* Search Bar */}
                <Card className="mb-6">
                    <CardBody>
                        <Input
                            icon="🔍"
                            placeholder="Rechercher par nom, adresse ou ville..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </CardBody>
                </Card>

                {/* Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-label">Total clients</div>
                        <div className="stat-value">{customers.length}</div>
                    </div>
                    <div className="stat-card">
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
                                    <th>Ville</th>
                                    <th>Informations</th>
                                    <th style={{ width: '150px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center text-muted" style={{ padding: '2rem' }}>
                                            {customers.length === 0
                                                ? 'Aucun client enregistré. Cliquez sur "Ajouter un client" pour commencer.'
                                                : 'Aucun résultat trouvé pour cette recherche.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCustomers.map((customer) => (
                                        <tr key={customer.id}>
                                            <td className="font-semibold">{customer.name}</td>
                                            <td>{customer.address || '-'}</td>
                                            <td>{customer.city || '-'}</td>
                                            <td className="text-muted text-sm">{customer.additional_info || '-'}</td>
                                            <td>
                                                <div className="table-actions">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openEditModal(customer)}
                                                        title="Modifier"
                                                    >
                                                        ✏️
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-danger"
                                                        onClick={() => handleDelete(customer.id)}
                                                        title="Supprimer"
                                                    >
                                                        🗑️
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

            {/* Add/Edit Modal */}
            <Modal
                isOpen={showModal}
                onClose={closeModal}
                title={editingCustomer ? 'Modifier le client' : 'Ajouter un client'}
                footer={
                    <>
                        <Button variant="outline" onClick={closeModal} disabled={isSubmitting}>
                            Annuler
                        </Button>
                        <Button onClick={handleSubmit} isLoading={isSubmitting}>
                            {editingCustomer ? 'Modifier' : 'Ajouter'}
                        </Button>
                    </>
                }
            >
                <form id="customer-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        label="Nom *"
                        value={formData.name}
                        onChange={handleInputChange('name')}
                        placeholder="Nom du client ou de l'entreprise"
                        required
                        autoFocus
                    />
                    <Textarea
                        label="Adresse"
                        value={formData.address}
                        onChange={handleInputChange('address')}
                        placeholder="Adresse complète"
                        rows={2}
                    />
                    <Input
                        label="Ville"
                        value={formData.city}
                        onChange={handleInputChange('city')}
                        placeholder="Ville"
                    />
                    <Textarea
                        label="Informations supplémentaires"
                        value={formData.additional_info}
                        onChange={handleInputChange('additional_info')}
                        placeholder="Notes, ICE, RC, etc."
                        rows={2}
                    />
                </form>
            </Modal>
        </>
    )
}

export default CustomersPage
