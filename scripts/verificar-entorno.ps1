#requires -Version 5.1
<#
PetPass EC3 / Parte 8: diagnóstico NO DESTRUCTIVO.
Ejecutar desde la raíz de petpass-movil:
  powershell -ExecutionPolicy Bypass -File .\scripts\verificar-entorno.ps1 -ApiUrl http://localhost:3000
No modifica bases, proyectos ni realiza operaciones de escritura.
#>
[CmdletBinding()]
param([string]$ApiUrl = 'http://localhost:3000')
$ErrorActionPreference = 'Stop'
Write-Host '=== PetPass EC3 · auditoría de entorno ==='
Write-Host "Ubicación: $(Get-Location)"
foreach ($file in @('package.json', 'package-lock.json', 'app.json', 'src/config.js', 'src/navigation/AppNavigator.js')) {
  if (Test-Path $file) { Write-Host "OK archivo: $file" }
  else { Write-Warning "Falta: $file" }
}
foreach ($tool in @('node', 'npm', 'git')) {
  $item = Get-Command $tool -ErrorAction SilentlyContinue
  if ($null -eq $item) { Write-Warning "No encuentro comando $tool" }
  else { Write-Host "OK comando: $tool" }
}
if (Test-Path 'package.json') {
  $package = Get-Content 'package.json' -Raw | ConvertFrom-Json
  Write-Host "Expo declarado: $($package.dependencies.expo)"
  foreach ($dep in @('expo-camera', 'expo-location', 'expo-image-picker', 'expo-image-manipulator', 'react-native-webview', 'react-native-qrcode-svg')) {
    $version = $package.dependencies.PSObject.Properties[$dep].Value
    if ($version) { Write-Host "OK dependencia: $dep ($version)" }
    else { Write-Warning "Falta dependencia: $dep" }
  }
}
if (Test-Path 'app.json') {
  $app = Get-Content 'app.json' -Raw | ConvertFrom-Json
  Write-Host "App name: $($app.expo.name)"
  Write-Host "Slug: $($app.expo.slug)"
  if ($app.expo.android.package) { Write-Host "Package Android: $($app.expo.android.package)" }
  else { Write-Warning 'Android package todavía sin definir' }
}
if (Test-Path 'eas.json') { Write-Host 'OK: eas.json existe' }
else { Write-Warning 'eas.json todavía sin crear' }
try {
  $health = Invoke-RestMethod -Uri "$($ApiUrl.TrimEnd('/'))/api/health" -TimeoutSec 8
  Write-Host "OK API health: $($health.status)"
} catch {
  Write-Warning "API no accesible: $($_.Exception.Message)"
}
try {
  $places = @(Invoke-RestMethod -Uri "$($ApiUrl.TrimEnd('/'))/api/lugares" -TimeoutSec 8)
  $gps = @($places | Where-Object {
    ($_.locationVerified -eq $true -or $_.locationVerified -eq 1) -and
    $null -ne $_.latitude -and $null -ne $_.longitude -and
    [string]$_.latitude -ne '' -and [string]$_.longitude -ne ''
  })
  Write-Host "Lugares: $($places.Count); candidatos GPS verificados: $($gps.Count)"
  if ($gps.Count -lt 6) { Write-Warning 'Menos de 6 GPS. Revisar PR backend y estado SQLite antes de aprobar mapa.' }
} catch {
  Write-Warning "No pude listar lugares: $($_.Exception.Message)"
}
Write-Host 'FIN: sin cambios en datos.'