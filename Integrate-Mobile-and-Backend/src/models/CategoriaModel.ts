export class Categoria {
  private _id_categoria: number = 0;
  private _dc_categoria: string = "";

  constructor(dc_categoria: string, id_categoria: number = 0) {
    this.dc_categoria = dc_categoria;
    this.id_categoria = id_categoria;
  }

  get id_categoria(): number {
    return this._id_categoria;
  }
  set id_categoria(value: number) {
    if (value < 0) {
      throw new Error("ID da categoria deve ser um número positivo.");
    }
    this._id_categoria = value;
  }

  get dc_categoria(): string {
    return this._dc_categoria;
  }
  set dc_categoria(value: string) {
    const nome = value.trim();
    if (!nome || nome.length < 2) {
      throw new Error("Nome da categoria deve ter pelo menos 2 caracteres.");
    }
    this._dc_categoria = nome;
  }

  static fromJSON(data: { id_categoria: number; dc_categoria: string }): Categoria {
    return new Categoria(data.dc_categoria, data.id_categoria);
  }
}
