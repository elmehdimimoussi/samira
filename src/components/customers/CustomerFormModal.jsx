import { Button } from '../ui/Button'
import { Input, Textarea } from '../ui/Input'
import { Modal } from '../ui/Modal'

export function CustomerFormModal({
  isOpen,
  isSubmitting,
  isEditing,
  formData,
  formErrors,
  onClose,
  onSubmit,
  onFieldChange,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Modifier le client' : 'Ajouter un client'}
      footer={(
        <>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button onClick={onSubmit} isLoading={isSubmitting}>
            {isEditing ? 'Modifier' : 'Ajouter'}
          </Button>
        </>
      )}
    >
      <form id="customer-form" onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input
          label="Nom *"
          value={formData.name}
          onChange={onFieldChange('name')}
          placeholder="Nom du client ou de l'entreprise"
          error={formErrors.name}
          required
          autoFocus
        />
        <Textarea
          label="Adresse"
          value={formData.address}
          onChange={onFieldChange('address')}
          placeholder="Adresse complète"
          rows={2}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Compte N°"
            value={formData.account_number}
            onChange={onFieldChange('account_number')}
            placeholder="Numéro de compte"
          />
          <Input
            label="Agence"
            value={formData.agency}
            onChange={onFieldChange('agency')}
            placeholder="Agence"
          />
        </div>
        <Input
          label="Ville"
          value={formData.city}
          onChange={onFieldChange('city')}
          placeholder="Ville"
        />
        <Textarea
          label="Informations supplémentaires"
          value={formData.additional_info}
          onChange={onFieldChange('additional_info')}
          placeholder="Notes, ICE, RC, etc."
          rows={2}
        />
      </form>
    </Modal>
  )
}
