# APLICACIÓN PASO A PASO DE ECUACIONES ALGEBRAICAS
## Materia: Certificación de software | Universidad Mesoamericana de San Agustín

Esta es una aplicación que funciona tanto para web como para Android e iOS. Sin embargo, para estas 2 últimas, será necesario realizar un prebuild ya que se usa ``` react-native-math-view ```, que es una dependencia que necesita recursos nativos para funcionar correctamente. A continuación, se explicará con lujo de detalle los pasos a realizar para que te funcione el proyecto en Android.\\

# REQUISITOS PREVIOS
Antes de poder correr el proyecto en Android, asegúrate de tener instalado lo siguiente:\
1. **Node.js:** Lo puedes descargar dando click [aquí](https://nodejs.org/).
2. **Expo CLI:** Instálalo globalmente con el siguiente comando: ``` npm install -g expo-cli ```.
3. **JDK (Java Development Kit)**: Se recomienda instalar JDK 17. Descargar [aquí](https://www.oracle.com/java/technologies/downloads/).
4. **Android Studio**: Descargar [aquí](https://developer.android.com/studio?gad_source=1&gad_campaignid=21831783804&gbraid=0AAAAAC-IOZm0UV8W5BiN2zqDrkK6OrpLd&gclid=CjwKCAjwg7PDBhBxEiwAf1CVu5-4ZuHjtFtNoZH6LsbuD3CIpbhsIPweqpww2KE0gqU6Y_4ckpv6ZhoCsd0QAvD_BwE&gclsrc=aw.ds&hl=es-419). Asegúrate de descargar.
   + **Android SDK**.
   + **Android SDK Command-line Tools**.
   + **AVD Manager (para emuladores)**
5. **Variables de entorno**: 
   #### ANDROID_HOME

   Configura la variable `ANDROID_HOME`. Por ejemplo:

   - En **macOS/Linux**:

     ```
     export ANDROID_HOME=$HOME/Library/Android/sdk
     export PATH=$PATH:$ANDROID_HOME/emulator
     export PATH=$PATH:$ANDROID_HOME/platform-tools
     export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
     ```

   - En **Windows**, añade estas rutas a la variable `PATH`:

     ```
     C:\Users\TU_USUARIO\AppData\Local\Android\Sdk\emulator
     C:\Users\TU_USUARIO\AppData\Local\Android\Sdk\platform-tools
     C:\Users\TU_USUARIO\AppData\Local\Android\Sdk\cmdline-tools\latest\bin
     ```

   #### JAVA_HOME

   También es necesario configurar `JAVA_HOME` apuntando a tu instalación del JDK:

   - En **macOS/Linux**:

     ```
     export JAVA_HOME=$(/usr/libexec/java_home -v 17)
     export PATH=$PATH:$JAVA_HOME/bin
     ```

   - En **Windows**:

     1. Abre **Configuración del sistema → Variables de entorno**.
     2. Crea una nueva variable:
        - **Nombre:** `JAVA_HOME`
        - **Valor:** Ruta donde instalaste el JDK (por ejemplo: `C:\Program Files\Java\jdk-17`)
     3. Añade esta ruta al `PATH`:

        ```
        %JAVA_HOME%\bin
        ```

   > **Importante:** Reinicia tu terminal (o el sistema en Windows) después de hacer estos cambios para que surtan efecto.
# INSTRUCCIONES DE INSTALACIÓN:
1. Clona este repositorio:

   ```
   git clone https://github.com/usuario/repositorio.git
   cd repositorio
   ```

2. Instala las dependencias:

   ```
   npm install
   ```
> NOTA: Considera poner el proyecto en una carpeta cuyo nombre no tenga espacios y que sea, en la medida de lo posible, una ubicación corta. Si estas en Windows, directamente en el directorio C://
# PREBUILD PARA ANDROID:
Expo gestiona muchas configuraciones automáticamente, pero en este caso necesitamos crear los archivos nativos porque `react-native-math-view` no funciona en el entorno gestionado por defecto.

1. Ejecuta el siguiente comando:

   ```
   npx expo prebuild --platform android
   ```

   Esto generará las carpetas `/android` y `/ios` en tu proyecto.

2. Verifica que las dependencias nativas estén correctamente vinculadas. Generalmente Expo lo maneja automáticamente, pero si llegas a tener errores, revisa los archivos como `android/app/build.gradle`.

# COMPILACIÓN:
1. Asegúrate de tener un emulador activo desde Android Studio o conecta un dispositivo físico con **depuración USB** activada.

2. Compila y corre la app:

   ```
   npx expo run:android
   ```
