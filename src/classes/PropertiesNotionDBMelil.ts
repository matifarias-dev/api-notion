import {
  type IMaquinaOption,
  type ITagOption,
  type ITipoDeEnvioOption
} from '../interfaces/notionMeliTableProperties.interface'

export default class PropertiesNotionDBMeli {
  tags = {
    id: '%3A%3CC%60',
    name: 'Tags',
    type: 'select',
    select: {
      options: [] as ITagOption[]
    }
  }

  Maquina = {
    id: '%3BkY%5C',
    name: 'Maquina',
    type: 'multi_select',
    multi_select: {
      options: [] as IMaquinaOption[]
    }
  }

  Created = {
    id: 'IyFV',
    name: 'Created',
    type: 'created_time',
    created_time: new Date()
  }

  FechaLimite = {
    id: '%5DQa_',
    name: 'Fecha Limite',
    type: 'date',
    date: {
      start: new Date(),
      end: null,
      time_zone: null
    }
  }

  Cliente = {
    id: 'eUY~',
    name: 'Cliente',
    type: 'rich_text',
    rich_text: [] as any
  }

  TipoDeEnvio = {
    id: 'nbO%5C',
    name: 'Tipo de envio',
    type: 'multi_select',
    multi_select: {
      options: [] as ITipoDeEnvioOption[]
    }
  }

  usuario = {
    id: 'wDKU',
    name: 'usuario',
    type: 'rich_text',
    rich_text: [] as any
  }

  Name = {
    id: 'title',
    name: 'Name',
    type: 'title',
    title: [] as any
  }

  public setTagsOptions (options: ITagOption[]): void {
    this.tags.select.options = options
  }

  public setMaquinaOptions (options: IMaquinaOption[]): void {
    this.Maquina.multi_select.options = options
  }

  public setTipoEnvioOptions (options: ITipoDeEnvioOption[]): void {
    this.TipoDeEnvio.multi_select.options = options
  }

  public setUsuario (nombre: string): void {
    this.usuario.rich_text = {
      type: 'text',
      text: {
        content: nombre,
        link: null
      },
      annotations: {
        bold: false,
        italic: false,
        strikethrough: false,
        underline: false,
        code: false,
        color: 'default'
      },
      plain_text: nombre,
      href: null
    }
  }

  public setTitle (title: string): void {
    this.Name.title = [
      {
        type: 'text',
        text: {
          content: title,
          link: null
        },
        annotations: {
          bold: true,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default'
        },
        plain_text: title,
        href: null
      }
    ]
  }

  public setCliente (nombre: string): void {
    this.Cliente.rich_text = {
      type: 'text',
      text: {
        content: nombre,
        link: null
      },
      annotations: {
        bold: false,
        italic: false,
        strikethrough: false,
        underline: false,
        code: false,
        color: 'default'
      },
      plain_text: nombre,
      href: null
    }
  }
}

export const TagOption = {
  para_empaquetar: {
    id: '49ed7959-291e-4114-a3ed-ceb3bec5f915',
    name: 'Para Empaquetar',
    color: 'orange',
    description: null
  },
  list_para_enviar: {
    id: '50615149-ca1d-4330-b822-35e207d35aad',
    name: 'Listos Para Enviar',
    color: 'yellow',
    description: null
  },
  pegar_etiqueta: {
    id: '79085116-4fd5-48dd-ab13-a3d9f8a2482f',
    name: 'Pegar etiqueta',
    color: 'green',
    description: null
  },
  flex_terminadas: {
    id: '3868876a-2854-414f-9974-038aa417d450',
    name: 'Flex terminadas',
    color: 'red',
    description: null
  },
  seven: {
    id: '1d365687-a9f5-4197-8a4b-0053a17ff284',
    name: '7',
    color: 'gray',
    description: null
  }
}

export const MaquinaOption = {
  router: {
    id: 'siq;',
    name: 'Router',
    color: 'blue',
    description: null
  },
  laser: {
    id: 'c7fd079b-5cb2-4bec-ab51-e5d652d64763',
    name: 'Laser',
    color: 'pink',
    description: null
  }
}

export const TipoDeEnvioOption = {
  correo_argentino: {
    id: 'f3630af8-328a-42ff-a120-5ddace23a01c',
    name: '3 Correo Argentino',
    color: 'purple',
    description: null
  },
  mercado_envios: {
    id: 't_R<',
    name: '2 Mercado Envio',
    color: 'yellow',
    description: null
  },
  particular_flex: {
    id: 'dfeb83e5-e4a9-487c-a173-d242de9540f2',
    name: '1 Particular (FLEX)',
    color: 'red',
    description: null
  },
  flex: {
    id: 'DcoM',
    name: '1 Flex',
    color: 'green',
    description: null
  }
}
