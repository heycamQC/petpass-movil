#requires -Version 5.1
<#
QA DE API SOLO EN BACKEND LOCAL DE PRUEBA.
Sin bandera: realiza GETs y no modifica datos.
Con -PermitirEscrituraControlada: crea SOLO una mascota de prueba, un registro
médico suyo, edita ambos y elimina la mascota creada al terminar.
NO CREA ALERTAS: en EC2 no existe DELETE /api/alertas y dejaría residuos.

Desde petpass-movil con API encendida en la laptop:
  powershell -ExecutionPolicy Bypass -File .\scripts\qa-api-controlada.ps1
  powershell -ExecutionPolicy Bypass -File .\scripts\qa-api-controlada.ps1 -PermitirEscrituraControlada
#>
[CmdletBinding()]
param(
  [string]$BaseUrl = 'http://localhost:3000',
  [switch]$PermitirEscrituraControlada
)
$ErrorActionPreference = 'Stop'
$BaseUrl = $BaseUrl.TrimEnd('/')
function Assert-Result([bool]$Condition, [string]$Message) {
  if (-not $Condition) { throw "FALLO: $Message" }
  Write-Host "OK: $Message"
}
function Invoke-PetPass([string]$Method, [string]$Path, $Data = $null) {
  $args = @{
    Uri = "$BaseUrl$Path"
    Method = $Method
    UseBasicParsing = $true
    TimeoutSec = 12
  }
  if ($null -ne $Data) {
    $args.ContentType = 'application/json; charset=utf-8'
    $args.Body = ($Data | ConvertTo-Json -Depth 12 -Compress)
  }
  $response = Invoke-WebRequest @args
  $decoded = $null
  if (-not [string]::IsNullOrWhiteSpace($response.Content)) {
    $decoded = $response.Content | ConvertFrom-Json
  }
  return [pscustomobject]@{ StatusCode = [int]$response.StatusCode; Data = $decoded }
}
Write-Host "=== QA PetPass API: $BaseUrl ==="
$health = Invoke-PetPass 'GET' '/api/health'
Assert-Result ($health.StatusCode -eq 200 -and $health.Data.status -eq 'ok') 'GET /api/health = 200 ok'
$pets = Invoke-PetPass 'GET' '/api/mascotas'
Assert-Result ($pets.StatusCode -eq 200) 'GET /api/mascotas = 200'
$alerts = Invoke-PetPass 'GET' '/api/alertas'
Assert-Result ($alerts.StatusCode -eq 200) 'GET /api/alertas = 200'
$places = Invoke-PetPass 'GET' '/api/lugares'
Assert-Result ($places.StatusCode -eq 200) 'GET /api/lugares = 200'
Write-Host "Mascotas: $(@($pets.Data).Count), alertas: $(@($alerts.Data).Count), lugares: $(@($places.Data).Count)"

if (-not $PermitirEscrituraControlada) {
  Write-Host 'Modo lectura completado. Para CRUD use copia local de SQLite, respaldo previo y -PermitirEscrituraControlada.'
  exit 0
}

if ($BaseUrl -notmatch '^https?://(localhost|127\.0\.0\.1):3000$') {
  throw 'Por seguridad, la escritura se permite únicamente en localhost:3000 o 127.0.0.1:3000.'
}
Write-Warning 'SE MODIFICARA LA SQLITE LOCAL DEL BACKEND. No ejecutar en datos importantes. Realice respaldo antes.'
$ack = Read-Host 'Escribe PRUEBA para confirmar escritura y eliminación de una mascota creada por el script'
if ($ack -cne 'PRUEBA') { throw 'Cancelado por usuario.' }

$createdId = $null
try {
  $uniqueName = "QA_EC3_$([DateTime]::Now.ToString('yyyyMMdd_HHmmss'))"
  $created = Invoke-PetPass 'POST' '/api/mascotas' @{ name=$uniqueName; species='Perro'; breed='Prueba'; age='2'; status='normal' }
  Assert-Result ($created.StatusCode -eq 201 -and $created.Data.id -gt 0) 'POST mascota = 201'
  $createdId = [int]$created.Data.id

  $readPet = Invoke-PetPass 'GET' "/api/mascotas/$createdId"
  Assert-Result ($readPet.StatusCode -eq 200 -and $readPet.Data.name -eq $uniqueName) 'GET mascota creada = 200'

  $updated = Invoke-PetPass 'PUT' "/api/mascotas/$createdId" @{ name="$uniqueName`_EDITADA"; species='Perro'; age='3' }
  Assert-Result ($updated.StatusCode -eq 200 -and$updated.Data.age -eq '3') 'PUT mascota = 200'

  $history = Invoke-PetPass 'GET' "/api/mascotas/$createdId/historial"
  Assert-Result ($history.StatusCode -eq 200) 'GET historial de mascota = 200'$date = Get-Date -Format 'yyyy-MM-dd'
  $record = Invoke-PetPass 'POST' "/api/mascotas/$createdId/historial" @{type='vaccine'; title='QA vacuna temporal'; date=$date; description='Solo prueba local'}
  Assert-Result ($record.StatusCode -eq 201 -and $record.Data.petId -eq$createdId) 'POST historial = 201'
  $recordId = [int]$record.Data.id
  $recordEdited = Invoke-PetPass 'PUT' "/api/historial/$recordId" @{type='consultation'; title='QA consulta temporal'; date=$date; description='Prueba'}
  Assert-Result ($recordEdited.StatusCode -eq 200 -and$recordEdited.Data.title -eq 'QA consulta temporal') 'PUT historial = 200'

  $afterMedical = Invoke-PetPass 'GET' "/api/mascotas/$createdId/historial"
  Assert-Result ($afterMedical.StatusCode -eq 200 -and @($afterMedical.Data).Count -ge 1) 'Persistencia médica comprobada'
  Write-Host "QA de escritura terminada; limpiando ID temporal $createdId."
}
finally {
  if ($null -ne$createdId) {
    try {
      $deleted = Invoke-PetPass 'DELETE' "/api/mascotas/$createdId"
      Assert-Result ($deleted.StatusCode -eq 204) 'DELETE mascota QA = 204 (sin cuerpo)'
      Write-Host 'La eliminación también borra el historial asociado mediante CASCADE.'
    } catch {
      Write-Warning "No pude eliminar mascota QA id=$createdId. Limpieza manual necesaria: $($_.Exception.Message)"
    }
  }
}
Write-Host 'FIN QA CRUD. NO se crearon alertas.'