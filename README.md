# TukiBot

# Objetivo del sprint:
Generar un bot con funcionalidad minima que este hosteado de manera local usando Discord.js, comunicarlo con una Lambda de AWS para que pueda obtener información de una DynamoDB.


# Descripción:
Este microservicio debe proporcionarle apoyo al administrador para moderar el chat del servidor, haciendo uso de una lista de palabras prohibidas las cuales son completamente gestionables por el administrador. Al detectar una palabra prohibida, el bot contestará al mensaje del usuario como una advertencia por su infracción.

# Comandos:
!addbannedworrds [palabras]
Este comando permite al usuario añadir palabras a la lista de palabras prohibidas. [palabras] deben ser mas de 1 palabra a añadir a la lista. Esta lista estará hosteada en AWS DynamoDB.

!deletebannedwords [palabras] (aun no implementado)
Este comando permite al usuario eliminar palabras que estén en su lista de palabras prohibidas. [palabras] deben ser más de 1 palabra a añadir a la lista. Esta lista estará hosteada en AWS DynamoDB.

!bannedwordslist (aun no implementado)
Este comando hará que el bot te muestre la lista de palabras que estén en la lista de palabras prohibidas.
