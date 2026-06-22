package com.devfix.config;

import com.devfix.entity.TechError;
import com.devfix.entity.Technology;
import com.devfix.repository.TechErrorRepository;
import com.devfix.repository.TechnologyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private TechnologyRepository technologyRepository;

    @Autowired
    private TechErrorRepository techErrorRepository;

    @Override
    public void run(String... args) throws Exception {
        // Seed Technologies
        List<Technology> existing = technologyRepository.findAll();
        List<Technology> toSave = new java.util.ArrayList<>();

        Technology t1 = existing.stream().filter(t -> "React".equals(t.getName())).findFirst().orElse(new Technology());
        t1.setName("React"); t1.setCategory("Frontend"); t1.setLatestVersion("19.0.0");
        t1.setDescription("A JavaScript library for building user interfaces.");
        t1.setDownloadUrl("https://react.dev/"); t1.setOfficialWebsite("https://react.dev/");
        t1.setInstallationSteps("1. Download and install Node.js (LTS version) from nodejs.org\n2. Open your terminal and verify installation by running: node -v and npm -v\n3. Create a new React project using Vite: npm create vite@latest my-app -- --template react-ts\n4. Navigate into your project folder: cd my-app\n5. Install dependencies: npm install\n6. Start the development server: npm run dev");
        toSave.add(t1);

        Technology t2 = existing.stream().filter(t -> "Spring Boot".equals(t.getName())).findFirst().orElse(new Technology());
        t2.setName("Spring Boot"); t2.setCategory("Backend"); t2.setLatestVersion("3.2.0");
        t2.setDescription("An extension of the Spring framework to build microservices.");
        t2.setDownloadUrl("https://spring.io/projects/spring-boot"); t2.setOfficialWebsite("https://spring.io/");
        t2.setInstallationSteps("1. Download and install Java JDK 17 or higher from adoptium.net\n2. Set your JAVA_HOME environment variable to the JDK installation path\n3. Download and install Maven (or use the Maven Wrapper included in Spring Initializr)\n4. Go to start.spring.io and generate a new Spring Boot project (select Web, JPA, PostgreSQL dependencies)\n5. Extract the downloaded zip and open the project in IntelliJ IDEA or Eclipse\n6. Run the main Application class to start the server");
        toSave.add(t2);

        Technology t3 = existing.stream().filter(t -> "PostgreSQL".equals(t.getName())).findFirst().orElse(new Technology());
        t3.setName("PostgreSQL"); t3.setCategory("Database"); t3.setLatestVersion("16.0");
        t3.setDescription("A powerful, open source object-relational database system.");
        t3.setDownloadUrl("https://www.postgresql.org/download/"); t3.setOfficialWebsite("https://www.postgresql.org/");
        t3.setInstallationSteps("1. Download the PostgreSQL installer for your OS from postgresql.org\n2. Run the installer and follow the setup wizard\n3. Set a strong password for the default 'postgres' user when prompted (remember this password!)\n4. Leave the default port as 5432\n5. Complete the installation and open pgAdmin or use psql via terminal to verify the connection\n6. Create a new database for your project");
        toSave.add(t3);

        Technology t4 = existing.stream().filter(t -> "Docker".equals(t.getName())).findFirst().orElse(new Technology());
        t4.setName("Docker"); t4.setCategory("DevOps"); t4.setLatestVersion("24.0");
        t4.setDescription("A platform designed to help developers build, share, and run container applications.");
        t4.setDownloadUrl("https://www.docker.com/products/docker-desktop/"); t4.setOfficialWebsite("https://www.docker.com/");
        t4.setInstallationSteps("1. Download Docker Desktop for Windows/Mac from docker.com\n2. Run the installer and follow the instructions\n3. If on Windows, ensure WSL 2 (Windows Subsystem for Linux) is installed and enabled\n4. Restart your computer if prompted\n5. Open Docker Desktop and accept the terms\n6. Open a terminal and run 'docker --version' to verify the installation");
        toSave.add(t4);

        Technology t5 = existing.stream().filter(t -> "Node.js".equals(t.getName())).findFirst().orElse(new Technology());
        t5.setName("Node.js"); t5.setCategory("Backend"); t5.setLatestVersion("20.9.0");
        t5.setDescription("An open-source, cross-platform JavaScript runtime environment.");
        t5.setDownloadUrl("https://nodejs.org/en/download/"); t5.setOfficialWebsite("https://nodejs.org/");
        t5.setInstallationSteps("1. Download the LTS (Long Term Support) version installer from nodejs.org\n2. Run the installer and accept the default settings\n3. Make sure 'Add to PATH' is checked during installation\n4. Open a new terminal window (or restart your IDE)\n5. Run 'node -v' to verify Node.js is installed\n6. Run 'npm -v' to verify the Node Package Manager is installed");
        toSave.add(t5);

        Technology t6 = existing.stream().filter(t -> "Maven".equals(t.getName())).findFirst().orElse(new Technology());
        t6.setName("Maven"); t6.setCategory("Build Tool"); t6.setLatestVersion("3.9.5");
        t6.setDescription("A software project management and comprehension tool.");
        t6.setDownloadUrl("https://maven.apache.org/download.cgi"); t6.setOfficialWebsite("https://maven.apache.org/");
        t6.setInstallationSteps("1. Download the latest Maven zip archive from maven.apache.org\n2. Extract the archive to your desired location (e.g., C:\\Program Files\\Apache\\maven)\n3. Open Environment Variables and add M2_HOME pointing to the extracted folder\n4. Add %M2_HOME%\\bin to the System Path variable\n5. Open a new terminal and run 'mvn -v' to verify installation");
        toSave.add(t6);

        Technology t7 = existing.stream().filter(t -> "Git".equals(t.getName())).findFirst().orElse(new Technology());
        t7.setName("Git"); t7.setCategory("Version Control"); t7.setLatestVersion("2.43.0");
        t7.setDescription("A free and open source distributed version control system.");
        t7.setDownloadUrl("https://git-scm.com/downloads"); t7.setOfficialWebsite("https://git-scm.com/");
        t7.setInstallationSteps("1. Download the Git installer for your operating system from git-scm.com\n2. Run the installer and proceed with the default settings (or customize as preferred)\n3. Open your terminal or Git Bash\n4. Configure your username: git config --global user.name \"Your Name\"\n5. Configure your email: git config --global user.email \"you@example.com\"\n6. Run 'git --version' to verify the installation");
        toSave.add(t7);

        Technology t8 = existing.stream().filter(t -> "Java JDK".equals(t.getName())).findFirst().orElse(new Technology());
        t8.setName("Java JDK"); t8.setCategory("Language"); t8.setLatestVersion("21.0");
        t8.setDescription("The Java Development Kit is a development environment for building applications using the Java programming language.");
        t8.setDownloadUrl("https://adoptium.net/"); t8.setOfficialWebsite("https://adoptium.net/");
        t8.setInstallationSteps("1. Navigate to adoptium.net and download the latest Temurin JDK installer\n2. Run the installer and ensure you select 'Add to PATH' and 'Set JAVA_HOME' during setup\n3. Complete the installation wizard\n4. Open a new command prompt or terminal\n5. Run 'java -version' to ensure the runtime is available\n6. Run 'javac -version' to verify the compiler is installed");
        toSave.add(t8);

        technologyRepository.saveAll(toSave);

        // Fetch all again after saving
        List<Technology> allTech = technologyRepository.findAll();

        // Seed Real-World Developer Errors to increase platform value
        if (techErrorRepository.count() == 0) {
            List<TechError> errorsToAdd = new java.util.ArrayList<>();

            Technology springBoot = allTech.stream().filter(t -> "Spring Boot".equals(t.getName())).findFirst().orElse(null);
            if (springBoot != null) {
                TechError err1 = new TechError();
                err1.setTechnology(springBoot);
                err1.setErrorCode("PORT_IN_USE");
                err1.setErrorMessage("Web server failed to start. Port 8080 was already in use.");
                err1.setCategory("Config"); err1.setSeverity("HIGH"); err1.setOsAffected("All");
                err1.setCause("Another application or an old instance of your Spring Boot app is already running on port 8080.");
                err1.setSolution("1. Find process: 'netstat -ano | findstr 8080' (Windows) or 'lsof -i :8080' (Mac/Linux)\n2. Kill it: 'taskkill /PID <PID> /F' or 'kill -9 <PID>'\n3. Or change port in application.properties: 'server.port=8081'");
                err1.setTags("spring,port,8080,startup");
                errorsToAdd.add(err1);

                TechError err2 = new TechError();
                err2.setTechnology(springBoot);
                err2.setErrorCode("JAVA_HOME_NOT_SET");
                err2.setErrorMessage("The JAVA_HOME environment variable is not defined correctly");
                err2.setCategory("Environment"); err2.setSeverity("CRITICAL"); err2.setOsAffected("Windows");
                err2.setCause("Maven/Spring Boot cannot find the Java Development Kit (JDK) to compile your code.");
                err2.setSolution("1. Download JDK 21\n2. Open Environment Variables\n3. Add new System Variable JAVA_HOME pointing to your JDK folder (e.g., C:\\Program Files\\Java\\jdk-21)\n4. Add %JAVA_HOME%\\bin to the Path variable");
                err2.setTags("java,env,maven,startup");
                errorsToAdd.add(err2);
            }

            Technology react = allTech.stream().filter(t -> "React".equals(t.getName())).findFirst().orElse(null);
            if (react != null) {
                TechError err3 = new TechError();
                err3.setTechnology(react);
                err3.setErrorCode("MODULE_NOT_FOUND");
                err3.setErrorMessage("Error: Cannot find module 'react-router-dom'");
                err3.setCategory("Dependency"); err3.setSeverity("HIGH"); err3.setOsAffected("All");
                err3.setCause("You are trying to import a package that has not been installed in your node_modules folder.");
                err3.setSolution("Run 'npm install react-router-dom' in your project terminal and restart your dev server.");
                err3.setTags("react,npm,import,dependencies");
                errorsToAdd.add(err3);
                
                TechError err4 = new TechError();
                err4.setTechnology(react);
                err4.setErrorCode("CORS_POLICY_ERROR");
                err4.setErrorMessage("Access to fetch at 'http://localhost:8080/api' from origin 'http://localhost:5173' has been blocked by CORS policy");
                err4.setCategory("Network"); err4.setSeverity("CRITICAL"); err4.setOsAffected("All");
                err4.setCause("Your browser prevents the frontend (port 5173) from accessing the backend (port 8080) for security reasons, and the backend isn't configured to allow it.");
                err4.setSolution("In your Spring Boot backend, add the @CrossOrigin annotation to your controller, or configure a global CorsRegistry in WebMvcConfigurer to allow origin http://localhost:5173.");
                err4.setTags("react,cors,fetch,network");
                errorsToAdd.add(err4);
            }

            Technology docker = allTech.stream().filter(t -> "Docker".equals(t.getName())).findFirst().orElse(null);
            if (docker != null) {
                TechError err5 = new TechError();
                err5.setTechnology(docker);
                err5.setErrorCode("DOCKER_DAEMON_NOT_RUNNING");
                err5.setErrorMessage("Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?");
                err5.setCategory("Environment"); err5.setSeverity("CRITICAL"); err5.setOsAffected("All");
                err5.setCause("The Docker background service is not running or your user doesn't have permissions to access it.");
                err5.setSolution("1. Open Docker Desktop application and wait for it to start.\n2. On Linux, run 'sudo systemctl start docker'.");
                err5.setTags("docker,daemon,startup,connection");
                errorsToAdd.add(err5);
            }

            Technology postgres = allTech.stream().filter(t -> "PostgreSQL".equals(t.getName())).findFirst().orElse(null);
            if (postgres != null) {
                TechError err6 = new TechError();
                err6.setTechnology(postgres);
                err6.setErrorCode("AUTH_FAILED");
                err6.setErrorMessage("FATAL: password authentication failed for user 'postgres'");
                err6.setCategory("Config"); err6.setSeverity("CRITICAL"); err6.setOsAffected("All");
                err6.setCause("The password provided in application.properties does not match the PostgreSQL database password.");
                err6.setSolution("Check spring.datasource.password in your application.properties and verify it matches what you set during PostgreSQL installation.");
                err6.setTags("postgres,auth,password,database");
                errorsToAdd.add(err6);
            }

            techErrorRepository.saveAll(errorsToAdd);
        }
    }
}
