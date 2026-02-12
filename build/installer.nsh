!macro customHeader
  !system "echo 'LC Pro Custom NSIS Installer'"
!macroend

!macro preInit
  ; Set default installation directory (user-level only, no admin required)
  SetRegView 64
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$LOCALAPPDATA\LC Pro"
  SetRegView 32
!macroend

!macro customInstall
  ; Create additional shortcuts
  CreateShortCut "$DESKTOP\LC Pro.lnk" "$INSTDIR\${APP_EXECUTABLE_FILENAME}" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME}" 0
!macroend

!macro customUnInstall
  ; Clean up shortcuts
  Delete "$DESKTOP\LC Pro.lnk"
!macroend
