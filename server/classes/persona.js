class Persona {

    constructor() {
        this.personas = [];
    }

    getPersona(id) {
        let persona = this.personas.filter(persona => persona.id === id)[0];
        return persona
    }

    getPersonas() {
        return this.personas;
    }

    getPersonasPorSala(sala) {
        let personasPorSala = this.personas.filter(persona => persona.sala === sala);
        return personasPorSala;
    }

    agregarPersona(id, nombre, sala) {
        let persona = {id, nombre, sala};
        this.personas.push(persona);
        return this.getPersonasPorSala(sala);
    }

    borrarPersona(id) {
        let persona = this.getPersona(id);
        this.personas = this.personas.filter(persona => persona.id !== id);

        return persona;
    }
}

module.exports = {Persona};
