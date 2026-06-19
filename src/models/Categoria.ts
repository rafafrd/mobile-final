export class Categoria {
  private id: number=0;
  private nome: string="";

  constructor(pNome: string, pId: number) {
    this.nome = pNome;
    this.id = pId;
  }

  // getters
  get Id(): number {
    return this.id;
  }
  get Nome(): string {
    return this.nome;
  }

  // setters
  set Id(value: number) {
    this.id = value;
  }
  set Nome(value: string) {
    this.nome = value.trim(); // remove espaços extras
    this.validarNome(value); // valida o nome antes de setar
  }

  // validação
  private validarId(value: number): boolean {
    if (value <= 0) {
      throw new Error("verifique o id da categoria");
    }
    return true;
  }
  private validarNome(value: string): boolean {
    if (!value || value.trim().length < 4) {
      throw new Error("verifique o nome da categoria");
    }
    return true;
  }
}