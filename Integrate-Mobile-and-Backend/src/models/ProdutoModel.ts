export class Produto {
  private _id_produto: number = 0;
  private _dc_produto: string = "";
  private _vl_produto: number = 0;
  private _id_categoria: number = 0;

  constructor(dc_produto: string, vl_produto: number, id_categoria: number, id_produto: number = 0) {
    this.dc_produto = dc_produto;
    this.vl_produto = vl_produto;
    this.id_categoria = id_categoria;
    this.id_produto = id_produto;
  }

  get id_produto(): number {
    return this._id_produto;
  }
  set id_produto(value: number) {
    if (value < 0) {
      throw new Error("ID do produto deve ser um número positivo.");
    }
    this._id_produto = value;
  }

  get dc_produto(): string {
    return this._dc_produto;
  }
  set dc_produto(value: string) {
    const nome = value.trim();
    if (!nome || nome.length < 2) {
      throw new Error("Nome do produto deve ter pelo menos 2 caracteres.");
    }
    this._dc_produto = nome;
  }

  get vl_produto(): number {
    return this._vl_produto;
  }
  set vl_produto(value: number) {
    if (Number.isNaN(value) || value < 0) {
      throw new Error("Valor do produto deve ser um número positivo.");
    }
    this._vl_produto = value;
  }

  get id_categoria(): number {
    return this._id_categoria;
  }
  set id_categoria(value: number) {
    if (!value || value <= 0) {
      throw new Error("Selecione uma categoria válida.");
    }
    this._id_categoria = value;
  }

  static fromJSON(data: { id_produto: number; dc_produto: string; vl_produto: number; id_categoria: number }): Produto {
    return new Produto(data.dc_produto, data.vl_produto, data.id_categoria, data.id_produto);
  }
}
