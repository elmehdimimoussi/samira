import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { formatDate } from '../services/dateFormatter'
import { Button } from '../components/ui/Button'
import { Card, CardBody } from '../components/ui/Card'
import { Input } from '../components/ui/Input'

function HistoryPage() {
    const navigate = useNavigate()
    const [operations, setOperations] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [dateFilter, setDateFilter] = useState({ from: '', to: '' })

    const loadOperations = useCallback(async () => {
        try {
            if (window.electronAPI) {
                const result = await window.electronAPI.operations.getAll()
                setOperations(result || [])
            }
        } catch (error) {
            console.error('Error loading operations:', error)
            toast.error('Erreur lors du chargement de l\'historique')
        }
    }, [])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadOperations()
    }, [loadOperations])

    const stats = useMemo(() => {
        const now = new Date()
        const thisMonth = now.getMonth()
        const thisYear = now.getFullYear()

        let totalAmount = 0
        let thisMonthAmount = 0

        operations.forEach(op => {
            const amount = parseFloat((op.amount_numeric || '0').replace(/\s/g, '').replace(',', '.'))
            totalAmount += amount

            // Check if operation is from this month
            const opDate = new Date(op.created_at)
            if (opDate.getMonth() === thisMonth && opDate.getFullYear() === thisYear) {
                thisMonthAmount += amount
            }
        })

        return {
            totalCount: operations.length,
            totalAmount,
            thisMonthAmount
        }
    }, [operations])

    const filteredOperations = useMemo(() => {
        return operations.filter(op => {
            // Text search
            const searchLower = searchQuery.toLowerCase()
            const matchesSearch = !searchQuery ||
                (op.beneficiary_name && op.beneficiary_name.toLowerCase().includes(searchLower)) ||
                (op.reference_number && op.reference_number.toLowerCase().includes(searchLower)) ||
                (op.amount_numeric && op.amount_numeric.includes(searchQuery))

            // Date filter
            let matchesDate = true
            if (dateFilter.from) {
                const opDate = new Date(op.created_at)
                const fromDate = new Date(dateFilter.from)
                if (opDate < fromDate) matchesDate = false
            }
            if (dateFilter.to) {
                const opDate = new Date(op.created_at)
                const toDate = new Date(dateFilter.to)
                toDate.setHours(23, 59, 59, 999)
                if (opDate > toDate) matchesDate = false
            }

            return matchesSearch && matchesDate
        })
    }, [operations, searchQuery, dateFilter])

    const handleDelete = async (id) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette opération ?')) {
            return
        }

        try {
            if (window.electronAPI) {
                await window.electronAPI.operations.delete(id)
                await loadOperations()
                toast.success('Opération supprimée')
            }
        } catch (error) {
            console.error('Error deleting operation:', error)
            toast.error('Erreur lors de la suppression')
        }
    }

    const handleClone = (operation) => {
        // Store operation data in sessionStorage and navigate to filling page
        sessionStorage.setItem('cloneOperation', JSON.stringify(operation))
        navigate('/')
        toast.success('Données copiées vers le formulaire')
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount).replace(/[\u202F\u00A0]/g, ' ')
    }

    return (
        <>
            <header className="page-header">
                <h1 className="page-title">Historique des Opérations</h1>
            </header>

            <div className="page-body">
                {/* Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-label">Total des opérations</div>
                        <div className="stat-value">{stats.totalCount}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Montant total</div>
                        <div className="stat-value">
                            {formatCurrency(stats.totalAmount)}
                            <span className="stat-suffix">DH</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Ce mois-ci</div>
                        <div className="stat-value">
                            {formatCurrency(stats.thisMonthAmount)}
                            <span className="stat-suffix">DH</span>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardBody>
                        <div className="flex gap-4 items-end flex-wrap">
                            <div className="flex-1 min-w-[200px]">
                                <Input
                                    icon="🔍"
                                    placeholder="Rechercher par bénéficiaire, référence ou montant..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    containerClassName="mb-0"
                                />
                            </div>
                            <div className="flex gap-2 items-center">
                                <Input
                                    type="date"
                                    value={dateFilter.from}
                                    onChange={(e) => setDateFilter(prev => ({ ...prev, from: e.target.value }))}
                                    containerClassName="mb-0 w-[150px]"
                                />
                                <span className="text-sm text-muted">au</span>
                                <Input
                                    type="date"
                                    value={dateFilter.to}
                                    onChange={(e) => setDateFilter(prev => ({ ...prev, to: e.target.value }))}
                                    containerClassName="mb-0 w-[150px]"
                                />
                                {(dateFilter.from || dateFilter.to) && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setDateFilter({ from: '', to: '' })}
                                    >
                                        ✖️
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Table */}
                <Card>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>N° Référence</th>
                                    <th>Bénéficiaire</th>
                                    <th style={{ textAlign: 'right' }}>Montant</th>
                                    <th>Échéance</th>
                                    <th style={{ width: '150px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOperations.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center text-muted" style={{ padding: '2rem' }}>
                                            {operations.length === 0
                                                ? 'Aucune opération enregistrée.'
                                                : 'Aucun résultat trouvé pour cette recherche.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOperations.map((op) => (
                                        <tr key={op.id}>
                                            <td>{formatDate(op.created_at)}</td>
                                            <td>
                                                <span className="badge badge-primary">{op.reference_number || '-'}</span>
                                            </td>
                                            <td className="font-semibold">{op.beneficiary_name || '-'}</td>
                                            <td style={{ textAlign: 'right' }}>
                                                <span className="font-semibold text-primary">
                                                    {op.amount_numeric || '0,00'} DH
                                                </span>
                                            </td>
                                            <td>{op.due_date || '-'}</td>
                                            <td>
                                                <div className="table-actions">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleClone(op)}
                                                        title="Cloner cette opération"
                                                    >
                                                        📋 Cloner
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-danger"
                                                        onClick={() => handleDelete(op.id)} /* Use op.id here as well */
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
        </>
    )
}

export default HistoryPage
