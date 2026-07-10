// Firestore Seed Script
// Run this once to populate your Firestore database with initial course data
// Usage: Open browser console on any page with Firebase loaded and run: seedFirestore()

async function seedFirestore() {
  if (!window.fb) {
    console.error('Firebase not loaded. Make sure firebase-config.js is included.');
    return;
  }

  console.log('Starting Firestore seed...');

  const courses = [
    {
      title: 'Smart Contracts con Solidity',
      slug: 'smart-contracts-solidity',
      category: 'Blockchain',
      badge: 'Nuevo',
      description: 'Aprende a crear contratos inteligentes en Ethereum desde cero',
      longDescription: 'En este curso aprenderás todo lo necesario para crear contratos inteligentes profesionales en la blockchain de Ethereum. Desde los conceptos básicos hasta técnicas avanzadas de desarrollo seguro. Al finalizar, serás capaz de desarrollar, testear y desplegar smart contracts que cumplan con los estándares de la industria.',
      duration: '8 horas',
      priceBs: 199,
      priceUsd: 29,
      originalPriceBs: 299,
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop',
      instructorId: '',
      instructorName: 'Ernesto Gonzales',
      instructorTitle: 'Smart Contracts Engineer',
      level: 'Intermedio',
      rating: 4.8,
      reviews: 120,
      students: 120,
      modules: [
        {
          title: 'Introducción a Blockchain',
          lessons: [
            { title: '¿Qué es Blockchain?', duration: '12 min', videoUrl: '' },
            { title: 'Cómo funciona Ethereum', duration: '15 min', videoUrl: '' },
            { title: 'Introducción a Smart Contracts', duration: '10 min', videoUrl: '' },
            { title: 'Ejercicio: Instalación de entorno', duration: '8 min', videoUrl: '', type: 'exercise' }
          ]
        },
        {
          title: 'Fundamentos de Solidity',
          lessons: [
            { title: 'Tipo de datos en Solidity', duration: '18 min', videoUrl: '' },
            { title: 'Variables y funciones', duration: '20 min', videoUrl: '' },
            { title: 'Estructuras de control', duration: '15 min', videoUrl: '' },
            { title: 'Arrays y mappings', duration: '22 min', videoUrl: '' },
            { title: 'Ejercicio: Primer contrato', duration: '15 min', videoUrl: '', type: 'exercise' }
          ]
        },
        {
          title: 'Contratos con Estado',
          lessons: [
            { title: 'State variables', duration: '15 min', videoUrl: '' },
            { title: 'Modifiers', duration: '12 min', videoUrl: '' },
            { title: 'Events y logging', duration: '18 min', videoUrl: '' },
            { title: 'Herencia de contratos', duration: '20 min', videoUrl: '' },
            { title: 'Ejercicio: Token ERC-20', duration: '10 min', videoUrl: '', type: 'exercise' }
          ]
        },
        {
          title: 'ERC-20 Tokens',
          lessons: [
            { title: 'Estándar ERC-20', duration: '15 min', videoUrl: '' },
            { title: 'Implementación desde cero', duration: '25 min', videoUrl: '' },
            { title: 'OpenZeppelin Contracts', duration: '20 min', videoUrl: '' },
            { title: 'Testing de tokens', duration: '15 min', videoUrl: '' },
            { title: 'Ejercicio: Token personalizado', duration: '5 min', videoUrl: '', type: 'exercise' }
          ]
        },
        {
          title: 'Testing con Hardhat',
          lessons: [
            { title: 'Configuración de Hardhat', duration: '15 min', videoUrl: '' },
            { title: 'Tests con Chai y Mocha', duration: '20 min', videoUrl: '' },
            { title: 'Coverage y gas reports', duration: '18 min', videoUrl: '' },
            { title: 'Ejercicio: Suite completa', duration: '17 min', videoUrl: '', type: 'exercise' }
          ]
        },
        {
          title: 'Seguridad y Auditoría',
          lessons: [
            { title: 'Vulnerabilidades comunes', duration: '20 min', videoUrl: '' },
            { title: 'Reentrancy attacks', duration: '15 min', videoUrl: '' },
            { title: 'Herramientas de auditoría', duration: '18 min', videoUrl: '' },
            { title: 'Ejercicio: Auditar contrato', duration: '12 min', videoUrl: '', type: 'exercise' }
          ]
        },
        {
          title: 'Despliegue en Mainnet',
          lessons: [
            { title: 'Redes de prueba', duration: '15 min', videoUrl: '' },
            { title: 'Despliegue con Hardhat', duration: '20 min', videoUrl: '' },
            { title: 'Verificación de contratos', duration: '20 min', videoUrl: '' }
          ]
        }
      ],
      included: [
        '8 horas de video HD',
        '15 proyectos prácticos',
        'Certificado de finalización',
        'Acceso de por vida',
        'Acceso en móvil y TV',
        'Soporte por WhatsApp'
      ],
      requirements: {
        prerequisites: [
          'Conocimientos básicos de programación',
          'Una computadora con acceso a internet',
          'Ganas de aprender'
        ],
        tools: [
          'VS Code o editor de código',
          'Node.js instalado',
          'MetaMask (extensión de navegador)'
        ]
      },
      published: true
    },
    {
      title: 'Forense Móvil Android',
      slug: 'forense-movil-android',
      category: 'Forense',
      badge: 'Popular',
      description: 'Análisis forense completo de dispositivos Android',
      longDescription: 'Domina las técnicas y herramientas de análisis forense para dispositivos Android. Aprende a extraer evidencia digital, analizar datos y generar reportes profesionales para investigaciones.',
      duration: '12 horas',
      priceBs: 299,
      priceUsd: 43,
      originalPriceBs: 399,
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f2?w=600&h=400&fit=crop',
      instructorId: '',
      instructorName: 'Ernesto Gonzales',
      instructorTitle: 'Forensic Analyst',
      level: 'Intermedio',
      rating: 4.7,
      reviews: 85,
      students: 85,
      modules: [
        {
          title: 'Introducción a la Forense Digital',
          lessons: [
            { title: '¿Qué es la forense digital?', duration: '15 min', videoUrl: '' },
            { title: 'Marco legal y ético', duration: '20 min', videoUrl: '' },
            { title: 'Cadena de custodia', duration: '18 min', videoUrl: '' }
          ]
        },
        {
          title: 'Herramientas de Análisis',
          lessons: [
            { title: 'ADB y Fastboot', duration: '25 min', videoUrl: '' },
            { title: 'Autopsy para Android', duration: '30 min', videoUrl: '' },
            { title: 'Magnet AXIOM', duration: '28 min', videoUrl: '' }
          ]
        },
        {
          title: 'Extracción de Datos',
          lessons: [
            { title: 'Extracción de filesystem', duration: '22 min', videoUrl: '' },
            { title: 'Análisis de base de datos SQLite', duration: '25 min', videoUrl: '' },
            { title: 'Recuperación de datos eliminados', duration: '20 min', videoUrl: '' }
          ]
        },
        {
          title: 'Análisis de Aplicaciones',
          lessons: [
            { title: 'Análisis de APKs', duration: '28 min', videoUrl: '' },
            { title: 'Logs y archivos temporales', duration: '20 min', videoUrl: '' },
            { title: 'Geolocalización y metadatos', duration: '22 min', videoUrl: '' }
          ]
        }
      ],
      included: [
        '12 horas de video HD',
        '10 laboratorios prácticos',
        'Certificado de finalización',
        'Acceso de por vida',
        'Soporte por WhatsApp'
      ],
      requirements: {
        prerequisites: [
          'Conocimientos básicos de Android',
          'Computadora con 8GB+ de RAM'
        ],
        tools: [
          'VirtualBox o VMWare',
          'Kali Linux o Parrot OS',
          'Dispositivo Android (para prácticas)'
        ]
      },
      published: true
    },
    {
      title: 'Ethical Hacking Práctico',
      slug: 'ethical-hacking-practico',
      category: 'Seguridad',
      badge: '',
      description: 'Aprende técnicas de hacking ético y pentesting',
      longDescription: 'Conviértete en un profesional de la ciberseguridad. Aprende metodologías de pentesting, reconocimiento, explotación y reporte de vulnerabilidades en sistemas y redes.',
      duration: '15 horas',
      priceBs: 349,
      priceUsd: 50,
      originalPriceBs: 499,
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop',
      instructorId: '',
      instructorName: 'Ernesto Gonzales',
      instructorTitle: 'Security Engineer',
      level: 'Intermedio',
      rating: 4.9,
      reviews: 200,
      students: 200,
      modules: [
        {
          title: 'Fundamentos de Seguridad',
          lessons: [
            { title: 'Metodología de pentesting', duration: '20 min', videoUrl: '' },
            { title: 'Ética y legalidad', duration: '15 min', videoUrl: '' },
            { title: 'Configuración del laboratorio', duration: '25 min', videoUrl: '' }
          ]
        },
        {
          title: 'Reconocimiento',
          lessons: [
            { title: 'OSINT y recopilación de info', duration: '30 min', videoUrl: '' },
            { title: 'Escaneo de puertos y servicios', duration: '25 min', videoUrl: '' },
            { title: 'Enumeración de vulnerabilidades', duration: '22 min', videoUrl: '' }
          ]
        },
        {
          title: 'Explotación',
          lessons: [
            { title: 'Metasploit Framework', duration: '35 min', videoUrl: '' },
            { title: 'SQL Injection', duration: '28 min', videoUrl: '' },
            { title: 'Cross-Site Scripting (XSS)', duration: '25 min', videoUrl: '' }
          ]
        },
        {
          title: 'Post-Explotación',
          lessons: [
            { title: 'Escalada de privilegios', duration: '22 min', videoUrl: '' },
            { title: 'Mantenimiento de acceso', duration: '20 min', videoUrl: '' },
            { title: 'Limpieza de rastros', duration: '18 min', videoUrl: '' }
          ]
        },
        {
          title: 'Reporte',
          lessons: [
            { title: 'Documentación de hallazgos', duration: '20 min', videoUrl: '' },
            { title: 'Generación de reportes', duration: '25 min', videoUrl: '' }
          ]
        }
      ],
      included: [
        '15 horas de video HD',
        '20 laboratorios prácticos',
        'Certificado de finalización',
        'Acceso de por vida',
        'Soporte por WhatsApp'
      ],
      requirements: {
        prerequisites: [
          'Conocimientos básicos de redes',
          'Familiaridad con Linux',
          'Ganas de aprender seguridad'
        ],
        tools: [
          'VirtualBox o VMWare',
          'Kali Linux',
          'Mínimo 8GB de RAM'
        ]
      },
      published: true
    },
    {
      title: 'Introducción a DeFi',
      slug: 'introduccion-defi',
      category: 'Blockchain',
      badge: 'Gratis',
      description: 'Conoce el mundo de las finanzas descentralizadas',
      longDescription: 'Descubre cómo las finanzas descentralizadas están transformando el sistema financiero tradicional. Aprende los conceptos fundamentales de DeFi, protocolos populares y cómo interactuar con ellos.',
      duration: '4 horas',
      priceBs: 0,
      priceUsd: 0,
      originalPriceBs: 0,
      image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&h=400&fit=crop',
      instructorId: '',
      instructorName: 'Ernesto Gonzales',
      instructorTitle: 'DeFi Researcher',
      level: 'Principiante',
      rating: 4.6,
      reviews: 350,
      students: 350,
      modules: [
        {
          title: '¿Qué es DeFi?',
          lessons: [
            { title: 'Introducción a las finanzas descentralizadas', duration: '20 min', videoUrl: '' },
            { title: 'Historia y evolución de DeFi', duration: '15 min', videoUrl: '' },
            { title: 'Protocolos principales', duration: '25 min', videoUrl: '' }
          ]
        },
        {
          title: 'Interactuando con DeFi',
          lessons: [
            { title: 'Wallets y Web3', duration: '20 min', videoUrl: '' },
            { title: 'Exchanges descentralizados (DEX)', duration: '25 min', videoUrl: '' },
            { title: 'Lending y Borrowing', duration: '22 min', videoUrl: '' }
          ]
        }
      ],
      included: [
        '4 horas de video HD',
        'Acceso de por vida',
        'Certificado de finalización'
      ],
      requirements: {
        prerequisites: [
          'Ningún requisito previo'
        ],
        tools: [
          'Navegador web',
          'Extensión MetaMask'
        ]
      },
      published: true
    },
    {
      title: 'Seguridad de Redes',
      slug: 'seguridad-redes',
      category: 'Seguridad',
      badge: '',
      description: 'Protege infraestructuras de redes empresariales',
      longDescription: 'Aprende a diseñar, implementar y mantener infraestructuras de redes seguras. Dominia firewalls, IDS/IPS, VPN y las mejores prácticas de seguridad perimetral.',
      duration: '10 horas',
      priceBs: 249,
      priceUsd: 36,
      originalPriceBs: 349,
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop',
      instructorId: '',
      instructorName: 'Ernesto Gonzales',
      instructorTitle: 'Network Security Specialist',
      level: 'Intermedio',
      rating: 4.5,
      reviews: 95,
      students: 95,
      modules: [
        {
          title: 'Fundamentos de Seguridad de Redes',
          lessons: [
            { title: 'Modelo OSI y seguridad', duration: '18 min', videoUrl: '' },
            { title: 'Tipos de amenazas', duration: '22 min', videoUrl: '' },
            { title: 'Principios de defensa en profundidad', duration: '20 min', videoUrl: '' }
          ]
        },
        {
          title: 'Firewalls y Seguridad Perimetral',
          lessons: [
            { title: 'Tipos de firewalls', duration: '25 min', videoUrl: '' },
            { title: 'Configuración de iptables', duration: '30 min', videoUrl: '' },
            { title: 'NGFW y UTM', duration: '22 min', videoUrl: '' }
          ]
        },
        {
          title: 'Monitoreo y Detección',
          lessons: [
            { title: 'IDS y IPS', duration: '25 min', videoUrl: '' },
            { title: 'SIEM y análisis de tráfico', duration: '28 min', videoUrl: '' },
            { title: 'Respuesta a incidentes', duration: '20 min', videoUrl: '' }
          ]
        }
      ],
      included: [
        '10 horas de video HD',
        '12 laboratorios prácticos',
        'Certificado de finalización',
        'Acceso de por vida'
      ],
      requirements: {
        prerequisites: [
          'Conocimientos básicos de redes TCP/IP',
          'Familiaridad con Linux'
        ],
        tools: [
          'VirtualBox o VMWare',
          'Mínimo 8GB de RAM',
          'Acceso a laboratorios virtuales'
        ]
      },
      published: true
    },
    {
      title: 'Desarrollo DApps',
      slug: 'desarrollo-dapps',
      category: 'Web3',
      badge: 'Próximamente',
      description: 'Crea aplicaciones descentralizadas fullstack',
      longDescription: 'Aprende a construir aplicaciones descentralizadas completas, desde los smart contracts en Solidity hasta el frontend con React y la integración con Web3.js y Ethers.js.',
      duration: '20 horas',
      priceBs: 399,
      priceUsd: 58,
      originalPriceBs: 599,
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop',
      instructorId: '',
      instructorName: 'Ernesto Gonzales',
      instructorTitle: 'Fullstack Web3 Developer',
      level: 'Avanzado',
      rating: 0,
      reviews: 0,
      students: 0,
      modules: [
        {
          title: 'Fundamentos de DApps',
          lessons: [
            { title: '¿Qué es una DApp?', duration: '15 min', videoUrl: '' },
            { title: 'Arquitectura de DApps', duration: '20 min', videoUrl: '' },
            { title: 'Stack tecnológico', duration: '18 min', videoUrl: '' }
          ]
        },
        {
          title: 'Smart Contracts para DApps',
          lessons: [
            { title: 'Patrones de diseño', duration: '25 min', videoUrl: '' },
            { title: 'Optimización de gas', duration: '22 min', videoUrl: '' },
            { title: 'Testing avanzado', duration: '28 min', videoUrl: '' }
          ]
        },
        {
          title: 'Frontend con React + Web3',
          lessons: [
            { title: 'Configuración del proyecto', duration: '20 min', videoUrl: '' },
            { title: 'Web3.js y Ethers.js', duration: '30 min', videoUrl: '' },
            { title: 'Conexión con wallets', duration: '25 min', videoUrl: '' }
          ]
        },
        {
          title: 'Despliegue y Mantenimiento',
          lessons: [
            { title: 'IPFS y almacenamiento descentralizado', duration: '22 min', videoUrl: '' },
            { title: 'Despliegue en producción', duration: '25 min', videoUrl: '' },
            { title: 'Monitoreo y actualizaciones', duration: '20 min', videoUrl: '' }
          ]
        }
      ],
      included: [
        '20 horas de video HD',
        '5 proyectos fullstack',
        'Certificado de finalización',
        'Acceso de por vida',
        'Soporte por WhatsApp'
      ],
      requirements: {
        prerequisites: [
          'Conocimientos de JavaScript y React',
          'Conocimientos básicos de Solidity',
          'Familiaridad con Node.js'
        ],
        tools: [
          'VS Code',
          'Node.js',
          'MetaMask',
          'Mínimo 16GB de RAM recomendado'
        ]
      },
      published: false
    }
  ];

  try {
    for (const course of courses) {
      await window.firebaseDB.collection('courses').add({
        ...course,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log(`✓ Created: ${course.title}`);
    }
    console.log('\n✅ Seed completed! All courses created successfully.');
  } catch (error) {
    console.error('❌ Error during seed:', error);
  }
}

// Make function available globally
window.seedFirestore = seedFirestore;

console.log('Seed script loaded. Run seedFirestore() in the console to populate Firestore.');
