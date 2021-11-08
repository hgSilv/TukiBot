# TukiBot

# Objetivo del sprint:
Generar un bot con funcionalidad minima que este hosteado de manera local usando Discord.js, comunicarlo con una Lambda de AWS para que pueda obtener información de una DynamoDB.


# Descripción:
Este microservicio debe proporcionarle apoyo al administrador para moderar el chat del servidor, haciendo uso de una lista de palabras prohibidas las cuales son completamente gestionables por el administrador. Al detectar una palabra prohibida, el bot contestará al mensaje del usuario como una advertencia por su infracción.

>** Actualizaciones del Sprint 2
# Comandos:
`!addbannedworrd [palabra]` **

Este comando permite al usuario añadir una palabra a la lista de palabras prohibidas. `[palabra]` debe ser solo 1 palabra a añadir a la lista. Esta lista estará hosteada en AWS DynamoDB.

`!deletebannedword [palabra]` **

Este comando permite al usuario eliminar palabras que estén en su lista de palabras prohibidas. `[palabra]` deben eliminar solo 1 palabra a la vez. Esta lista está almacenada en AWS DynamoDB.

`!bannedwordslist` **

Este comando hará que el bot muestre la lista de palabras prohibidas en el server. Esta lista es obtenida haciendo un GET request a AWS DynamoDB, donde están almacenadas.

`!getJoke` **

Este comando hará que el bot muestre un elemento aleatorio de la colección llamada `jokes` en la base de datos de Firebase.

`!setReminder [fecha] [descripción]` (en proceso) **

Este comando agregará un recordatorio a la colección llamada `reminders` en la base de datos de Firebase. Este recordatorio se enviará en la fecha y hora indicadas en el comando.

---

## Firebase functions **
Antes de hacer deploy a una funcion de firebase, probar con:

```
firebase emulators:start
```

### Deploy de funciones **
```
firebase deploy --only functions
// OR
firebase deploy --only functions:functionName
```

>By default, the Firebase CLI looks in the functions/ folder for the source code. You can specify another folder by adding the following lines in firebase.json:
```
"functions": {
  "source": "another-folder"
}
```
