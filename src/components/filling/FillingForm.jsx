import { useId } from 'react'
import { ArrowRight, Check, CheckCircle2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input, Textarea } from '../ui/Input'
import { Accordion, AccordionItem } from '../ui/Accordion'
import { useDrawerAutocomplete } from '../../hooks/useDrawerAutocomplete'
import { SECTIONS, SECTION_LABELS } from '../../hooks/useLCForm'

export function FillingForm({
  formData,
  activeSection,
  setActiveSection,
  sectionStatus,
  customers,
  applySelectedCustomer,
  isFrameEnabled,
  handleInputChange,
  handleAmountChange,
  nextSection,
  saveOperation,
}) {
  const drawerNameId = useId()

  const {
    showAutocomplete,
    filteredCustomers,
    activeIndex,
    listId,
    getOptionId,
    handleSearchChange,
    handleFocus,
    handleBlur,
    handleKeyDown,
    setOptionRef,
    selectCustomer,
  } = useDrawerAutocomplete(customers)

  const handleDrawerChange = (event) => {
    const value = event.target.value
    setActiveSection('drawer')
    handleInputChange('drawerName')(event)
    handleSearchChange(value)
  }

  const handleSelectCustomer = (customer) => {
    selectCustomer(customer, applySelectedCustomer)
  }

  const renderNextButton = () => (
    <div className="mt-4 flex justify-end">
      <Button size="sm" onClick={nextSection} className="gap-1">
        Suivant <ArrowRight size={14} />
      </Button>
    </div>
  )

  return (
    <div className="filling-form pb-20">
      <div className="progress-steps mb-5">
        {SECTIONS.map((section, index) => (
          <div key={section} className="progress-step flex items-center">
            <button
              onClick={() => setActiveSection(section)}
              className={`progress-step-dot ${
                activeSection === section ? 'active' : sectionStatus[section] ? 'completed' : 'pending'
              }`}
              title={SECTION_LABELS[section]}
            >
              {sectionStatus[section] && activeSection !== section ? <Check size={14} strokeWidth={2.5} /> : <span>{index + 1}</span>}
            </button>
            <span className="progress-step-label">{SECTION_LABELS[section]}</span>
            {index < SECTIONS.length - 1 && (
              <div className={`progress-step-line ${sectionStatus[section] ? 'completed' : ''}`} />
            )}
          </div>
        ))}
      </div>

      <Accordion type="single" value={activeSection} onValueChange={setActiveSection} className="w-full">
        <AccordionItem value="general" title="1. Informations Générales">
          <div className="grid grid-cols-2 gap-4">
            {isFrameEnabled('date_due') && (
              <Input type="date" label="Date d'échéance" value={formData.dateDue} onChange={handleInputChange('dateDue')} />
            )}
            {(isFrameEnabled('amount_numeric') || isFrameEnabled('amount_text')) && (
              <Input
                label="Montant (DH)"
                className="font-mono text-lg font-bold text-right"
                placeholder="0,00"
                value={formData.amount}
                onChange={handleAmountChange}
                autoFocus
              />
            )}
          </div>
          {formData.amount && (isFrameEnabled('amount_numeric') || isFrameEnabled('amount_text')) && (
            <div className="mt-3 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-blue-50/50 p-3 text-sm font-medium text-blue-700 dark:border-blue-800/50 dark:from-blue-900/20 dark:to-blue-900/10 dark:text-blue-300">
              {formData.amount} DH
            </div>
          )}
          {renderNextButton()}
        </AccordionItem>

        <AccordionItem value="tireur" title="2. Le Tireur (Vous)">
          <div className="space-y-4">
            {isFrameEnabled('tireur_name') && (
              <Input
                label="Nom ou dénomination"
                value={formData.tireurName}
                onChange={handleInputChange('tireurName')}
                placeholder="Votre nom ou société"
              />
            )}
            {isFrameEnabled('tireur_address') && (
              <Textarea label="Adresse ou siège" rows={2} value={formData.tireurAddress} onChange={handleInputChange('tireurAddress')} />
            )}
          </div>
          {renderNextButton()}
        </AccordionItem>

        <AccordionItem value="beneficiary" title="3. Bénéficiaire & Détails">
          <div className="space-y-4">
            {isFrameEnabled('beneficiary_name') && (
              <Input
                label="Bénéficiaire"
                value={formData.beneficiaryName}
                onChange={handleInputChange('beneficiaryName')}
                placeholder="Nom du bénéficiaire"
              />
            )}
            {formData.amountText && isFrameEnabled('amount_text') && (
              <div className="rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-emerald-50/50 p-3.5 text-sm italic leading-relaxed text-emerald-800 dark:border-emerald-800/50 dark:from-emerald-900/20 dark:to-emerald-900/10 dark:text-emerald-300">
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-emerald-500 not-italic dark:text-emerald-400">
                  Montant en lettres
                </span>
                {formData.amountText}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              {isFrameEnabled('creation_place') && (
                <Input label="Lieu de création" value={formData.creationPlace} onChange={handleInputChange('creationPlace')} />
              )}
              {isFrameEnabled('date_creation') && (
                <Input type="date" label="Date de création" value={formData.creationDate} onChange={handleInputChange('creationDate')} />
              )}
            </div>
            {isFrameEnabled('cause') && (
              <Input label="La cause" value={formData.cause} onChange={handleInputChange('cause')} placeholder="Ex: Facture N° 123" />
            )}
          </div>
          {renderNextButton()}
        </AccordionItem>

        <AccordionItem value="drawer" title="4. Le Tiré (Client)">
          <div className="space-y-4">
            {isFrameEnabled('drawer_name') && (
              <div className="form-group relative mb-0">
                <label htmlFor={drawerNameId} className="form-label">Nom ou dénomination</label>
                <div className="autocomplete-container">
                  <input
                    id={drawerNameId}
                    type="text"
                    className="form-input font-bold"
                    placeholder="Rechercher un client..."
                    value={formData.drawerName}
                    onChange={handleDrawerChange}
                    onFocus={() => handleFocus(formData.drawerName)}
                    onBlur={handleBlur}
                    onKeyDown={(event) => handleKeyDown(event, handleSelectCustomer)}
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={showAutocomplete}
                    aria-controls={showAutocomplete ? listId : undefined}
                    aria-activedescendant={activeIndex >= 0 ? getOptionId(activeIndex) : undefined}
                  />
                  {showAutocomplete && (
                    <div id={listId} className="autocomplete-dropdown" role="listbox">
                      {filteredCustomers.map((customer, index) => (
                        <div
                          key={customer.id}
                          id={getOptionId(index)}
                          ref={(node) => setOptionRef(index, node)}
                          className={`autocomplete-item ${activeIndex === index ? 'active' : ''}`}
                          role="option"
                          aria-selected={activeIndex === index}
                          onPointerDown={(event) => {
                            event.preventDefault()
                            handleSelectCustomer(customer)
                          }}
                        >
                          <div className="autocomplete-item-name">{customer.name}</div>
                          {customer.address && <div className="autocomplete-item-address">{customer.address}</div>}
                        </div>
                      ))}
                      {filteredCustomers.length === 0 && <div className="autocomplete-empty">Aucun client trouve</div>}
                    </div>
                  )}
                </div>
              </div>
            )}

            {isFrameEnabled('drawer_address') && (
              <Textarea label="Adresse ou siège" rows={2} value={formData.drawerAddress} onChange={handleInputChange('drawerAddress')} />
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {isFrameEnabled('account_number') && (
                <Input label="Compte N°" value={formData.accountNumber} onChange={handleInputChange('accountNumber')} />
              )}
              {isFrameEnabled('agency') && <Input label="Agence" value={formData.agency} onChange={handleInputChange('agency')} />}
            </div>
            {isFrameEnabled('city') && <Input label="Ville" value={formData.city} onChange={handleInputChange('city')} />}
          </div>
          {renderNextButton()}
        </AccordionItem>

        <AccordionItem value="footer" title="5. Pied de page (Optionnel)">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {isFrameEnabled('date_acceptance') && (
              <Input
                type="date"
                label="Date de l'acceptation"
                value={formData.dateAcceptance}
                onChange={handleInputChange('dateAcceptance')}
              />
            )}
            {isFrameEnabled('aval') && <Input label="Bon pour aval" value={formData.aval} onChange={handleInputChange('aval')} />}
          </div>
          <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-700/50">
            <Button variant="accent" onClick={saveOperation} className="w-full py-3">
              <CheckCircle2 size={18} /> Terminer & Enregistrer
            </Button>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
