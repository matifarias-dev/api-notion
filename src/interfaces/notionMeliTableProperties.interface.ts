export interface ITagOption {
  para_empaquetar: {
    id: string
    name: string
    color: string
    description: string | null
  }
  list_para_enviar: {
    id: string
    name: string
    color: string
    description: string | null
  }
  pegar_etiqueta: {
    id: string
    name: string
    color: string
    description: string | null
  }
  flex_terminadas: {
    id: string
    name: string
    color: string
    description: string | null
  }
  seven: {
    id: string
    name: string
    color: string
    description: string | null
  }
}

export interface IMaquinaOption {
  router: {
    id: string
    name: string
    color: string
    description: string | null
  }
  laser: {
    id: string
    name: string
    color: string
    description: string | null
  }
}

export interface ITipoDeEnvioOption {
  correo_argentino: {
    id: string
    name: string
    color: string
    description: string | null
  }
  mercado_envios: {
    id: string
    name: string
    color: string
    description: string | null
  }
  particular_flex: {
    id: string
    name: string
    color: string
    description: string | null
  }
  flex: {
    id: string
    name: string
    color: string
    description: string | null
  }
}
