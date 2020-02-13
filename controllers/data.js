let rubros = [
    {
        rubro: "ACCESORIOS",
        subrubros: {
            codigo: [421,422,423,424,425,426],
            titulo: ["ACCESORIOS","ACCESORIOS","ACCESORIOS","ACCESORIOS","ACCESORIOS","ACCESORIOS"]
        }
    },
    {
        rubro: "ADMISION Y ESCAPE",
        subrubros: {
            codigo: [930,933,934,935],
            titulo: ["PARTES MULTIPLE ADMISION","PARTES MULTIPLE Y CAÑO ESCAPE","PARTES MULTIPLE Y CAÑO ESCAPE","SOPORTES CAÑO DE ESCAPE"]
        }
    },
    {
        rubro: "ARRANQUE",
        subrubros: {
            codigo: [968],
            titulo: ["INTERRUPTORES"]
        }    
    },
    {
        rubro: "AIRE ACONDICIONADO",
        subrubros: {
            codigo: [440],
            titulo: ["AIRE ACONDICIONADO"]
        }    
    },
    {
        rubro: "BIDONES RADIADOR",
        subrubros: {
            codigo: [400,401],
            titulo: ["TAPAS","BIDONES"]
        }    
    },
    {
        rubro: "BULBOS",
        subrubros: {
            codigo: [965,967],
            titulo: ["TEMPERATURA/PRESION/ELECTRO","MARCHA ATRAS"]
        }    
    },
    {
        rubro: "CAJA DE VELOCIDAD",
        subrubros: {
            codigo: [600,620],
            titulo: ["PARTES DE VELOCIMETRO","PARTES CAJA DE VELOCIDAD"]
        }    
    },
    {
        rubro: "CALEFACCION",
        subrubros: {
            codigo: [450,451,453,454],
            titulo: ["RADIADORES","GRIFOS","CAÑOS","TAPONES Y CONECTORES"]
        }    
    },
    {
        rubro: "CARTER DE ACEITE",
        subrubros: {
            codigo: [916,917],
            titulo: ["CARTERS","PARTES"]
        }    
    },
    {
        rubro: "COMBUSTIBLE",
        subrubros: {
            codigo: [795,802,804],
            titulo: ["PARTES DE COMBUSTIBLE","BOMBAS CEBADORAS","PREFILTROS GAS OIL"]
        }    
    },
    {
        rubro: "CONEXIONES DISTRIBUIDORAS AGUA",
        subrubros: {
            codigo: [500],
            titulo: ["CONEXIONES DISTRIBUIDORAS AGUA"]
        }    
    },
    {
        rubro: "DIFERENCIAL/CARDAN",
        subrubros: {
            codigo: [710,720,730],
            titulo: ["PARTES DE DIFERENCIAL","PARTES DE PALIER","PARTES DE CARDAN"]
        }    
    },
    {
        rubro: "DIRECCION",
        subrubros: {
            codigo: [660],
            titulo: ["PARTES COLUMNA DIRECCION"]
        }    
    },
    {
        rubro: "ELECTRICIDAD",
        subrubros: {
            codigo: [970,971,974,978],
            titulo: ["CONMUTADOR DE LUCES","PALANCAS LUZ DE GIRO","TECLA LUZ BALIZAS","MASTIL ANTENA TECHO"]
        }    
    },
    {
        rubro: "EMBRAGUE",
        subrubros: {
            codigo: [10,100,101,150],
            titulo: ["HORQUILLAS","CRAPODINAS","BOMBAS Y CILINDROS","PARTES PEDAL"]
        }    
    },
    {
        rubro: "ENCENDIDO",
        subrubros: {
            codigo: [955,958],
            titulo: ["PARTES DE DISTRIBUIDOR","LLAVES Y ALARGUES DE BUJIA"]
        }    
    },
    {
        rubro: "FLEXIBLES DE MANOMETRO",
        subrubros: {
            codigo: [979],
            titulo: ["FLEXIBLES MANOMETRO"]
        }    
    },
    {
        rubro: "FRENO",
        subrubros: {
            codigo: [200,210,215,220,240,260,280,300,350,370,380],
            titulo: ["PALANCAS FRENO DE MANO","PARTES DE DEPRESOR Y COMPRESOR","BULBOS DE STOP","DEPOSITOS LIQUIDO DE FRENO","VALVULAS DE SERVO FRENO","CONEXIONES-TUERCAS-PURGADORES","FLEXIBLES","PARTES DE CALIPER","PARTES DE PATIN","PARTES DE PATIN","KIT RESORTES PATIN"]
        }    
    },
    {
        rubro: "LAVAPARABRISAS",
        subrubros: {
            codigo: [980,981,982,983],
            titulo: ["BIDONES","BOMBAS","PALANCAS","PARTES"]
        }    
    },
    {
        rubro: "LLAVES DE LUCES",
        subrubros: {
            codigo: [972],
            titulo: ["LLAVES DE LUCES"]
        }    
    },
    {
        rubro: "LUBRICACION",
        subrubros: {
            codigo: [926,927],
            titulo: ["CAÑOS DE TURBO","CAÑOS DE DEPRESOR"]
        }    
    },
    {
        rubro: "MOTOR",
        subrubros: {
            codigo: [825,880,881,882,883,884,885,886,887,888,900,905],
            titulo: ["PARTES CIGUEÑAL","PARTES TAPA DE CILINDROS","ARBOLES DE LEVAS","PARTES ARBOL DE LEVAS","PARTES DE VALVULAS","PARTES DE VALVULAS","PARTES DE VALVULAS","PARTES DE VALVULAS","PARTES DE VALVULAS","PARTES DE VALVULAS","KIT TAPONES BLOCK","TAPONES DE BLOCK"]
        }    
    },
    {
        rubro: "PARTES ACELERADOR",
        subrubros: {
            codigo: [780],
            titulo: ["PARTES DE ACELERADOR"]
        }    
    },
    {
        rubro: "PARTES BOMBA AGUA",
        subrubros: {
            codigo: [550,560,580],
            titulo: ["PARTES","POLEAS","CAÑOS SALIDA"]
        }    
    },
    {
        rubro: "PARTES BOMBA DE ACEITE",
        subrubros: {
            codigo: [910],
            titulo: ["PARTES BOMBA DE ACEITE"]
        }    
    },
    {
        rubro: "PARTES CARBURADOR",
        subrubros: {
            codigo: [785],
            titulo: ["PARTES DE CARBURADOR"]
        }    
    },
    {
        rubro: "PARTES DE ALTERNADOR",
        subrubros: {
            codigo: [960],
            titulo: ["PARTES DE ALTERNADOR"]
        }    
    },
    {
        rubro: "PARTES DE RADIADOR",
        subrubros: {
            codigo: [430],
            titulo: ["PARTES DE RADIADOR"]
        }    
    },
    {
        rubro: "PARTES DE VENTILADOR",
        subrubros: {
            codigo: [570],
            titulo: ["VENTILADORES PLASTICOS"]
        }    
    },
    {
        rubro: "PARTES DISTRIBUCION",
        subrubros: {
            codigo: [830,835,840,850],
            titulo: ["ENGRANAJES/CADENAS","TAPAS","ENGRANAJES","TENSORES"]
        }    
    },
    {
        rubro: "PARTES FILTRO AIRE",
        subrubros: {
            codigo: [790],
            titulo: ["PARTES FILTRO DE AIRE"]
        }    
    },
    {
        rubro: "PARTES PALANCA/SELECTOR CAMBIOS",
        subrubros: {
            codigo: [640,641,642,643],
            titulo: ["PARTES PALANCA CAMBIOS","PARTES PALANCA CAMBIOS","PARTES PALANCA CAMBIOS","PARTES PALANCA CAMBIOS"]
        }    
    },
    {
        rubro: "PARTES PUERTA/CERRAJERIA",
        subrubros: {
            codigo: [977],
            titulo: ["PARTES DE PUERTA Y CERRAJERIA"]
        }    
    },
    {
        rubro: "PARTES TAPA DE VALVULAS",
        subrubros: {
            codigo: [871,870,872],
            titulo: ["JUNTAS","PARTES","TAPAS ENTRADA DE ACEITE"]
        }    
    },
    {
        rubro: "POLEAS CIGUEÑAL",
        subrubros: {
            codigo: [810],
            titulo: ["POLEAS DE CIGUEÑAL"]
        }    
    },
    {
        rubro: "POLEAS VISCOSAS",
        subrubros: {
            codigo: [540],
            titulo: ["POLEAS VISCOSAS DE VENTILADOR"]
        }    
    },
    {
        rubro: "RADIADOR DE ACEITE",
        subrubros: {
            codigo: [924,925],
            titulo: ["PARTES RADIADOR","PARTES RADIADOR"]
        }    
    },
    {
        rubro: "RELAY ELECTROVENTILADORES",
        subrubros: {
            codigo: [975],
            titulo: ["RELAY DE ELECTROVENTILADORES"]
        }    
    },
    {
        rubro: "RUEDAS/PUNTA EJE",
        subrubros: {
            codigo: [740,750,760,770],
            titulo: ["PARTES DE RUEDA","PARTES DE SEMIEJE","PARTES PUNTA EJE DELANTERA","PARTES PUNTA EJE TRASERA"]
        }    
    },
    {
        rubro: "SENSORES CIGUEÑAL/ARBOL LEVAS",
        subrubros: {
            codigo: [962],
            titulo: ["SENSORES CIGUEÑAL/ARBOL LEVAS"]
        }    
    },
    {
        rubro: "SOPORTES DE CABINA",
        subrubros: {
            codigo: [950,951,952],
            titulo: ["KIT SOPORTES DE CABINA","KIT SOPORTES DE CABINA","KIT SOPORTES DE CABINA"]
        }    
    },
    {
        rubro: "SOPORTES MOTOR",
        subrubros: {
            codigo: [940,941,942,943,944],
            titulo: ["SOPORTES DE MOTOR","SOPORTES DE MOTOR","SOPORTES DE MOTOR","SOPORTES DE MOTOR","SOPORTES DE MOTOR"]
        }    
    },
    {
        rubro: "SUSPENSION",
        subrubros: {
            codigo: [680,681,682,685,689],
            titulo: ["PARTES SUSPENSION","PARTES BARRA ESTABILIZADORA","PARTES DE AMORTIGUADOR","PARTES RESORTES SUSPENSION","PARTES SUSPENSION TRASERA"]
        }    
    },
    {
        rubro: "TAPAS ENTRADA DE ACEITE",
        subrubros: {
            codigo: [874],
            titulo: ["TAPAS ENTRADA DE ACEITE"]
        }    
    },
    {
        rubro: "TECLAS ALZA CRISTAL",
        subrubros: {
            codigo: [976],
            titulo: ["TECLAS ALZA CRISTAL"]
        }    
    },
    {
        rubro: "TENSORES POLI V",
        subrubros: {
            codigo: [860],
            titulo: ["TENSORES DE CORREAS POLI V"]
        }    
    },
    {
        rubro: "TERMOSTATOS",
        subrubros: {
            codigo: [520],
            titulo: ["PARTES DE TERMOSTATO"]
        }  
    },
    {
        rubro: "VARILLAS NIVEL ACEITE",
        subrubros: {
            codigo: [920],
            titulo: ["VARILLAS NIVEL DE ACEITE"]
        }    
    }

];

module.exports = rubros;