class Customer {
  constructor(id, name, email, phone, type, address) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.type = type;
    this.address = address;
  }

  // Princípio de Demeter: o serviço solicita
  // as informações ao cliente, sem acessar
  // diretamente os detalhes internos do endereço.
  getCity() {
    return this.address.city;
  }

  getState() {
    return this.address.state;
  }

  getRegion() {
    return this.address.region;
  }
}

module.exports = Customer;


