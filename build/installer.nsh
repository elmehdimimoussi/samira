!macro customHeader
  !system "echo 'LC Pro Custom NSIS Installer'"
!macroend

!macro preInit
  ; Set default installation directory
  SetRegView 64
  WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "$PROGRAMFILES64\LC Pro"
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$LOCALAPPDATA\LC Pro"
  SetRegView 32
!macroend

!macro customInstall
  ; Create additional shortcuts
  CreateShortCut "$DESKTOP\LC Pro.lnk" "$INSTDIR\${APP_EXECUTABLE_FILENAME}" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME}" 0
  
  ; Register file associations (optional, for future use)
  ; WriteRegStr HKCR ".lcpro" "" "LCPro.Document"
  ; WriteRegStr HKCR "LCPro.Document" "" "LC Pro Document"
!macroend

!macro customUnInstall
  ; Clean up shortcuts
  Delete "$DESKTOP\LC Pro.lnk"
!macroend
