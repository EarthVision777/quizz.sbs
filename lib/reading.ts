import type { Answers } from "@/lib/storage"

export type Reading = {
  you: string
  them: string
  name: string
  line: string
  letter: string
  insights: { title: string; body: string }[]
  week: string[]
  stop: string[]
}

export function displayName(value: string | undefined, fallback: string) {
  const cleaned = (value ?? "").replace(/\s+/g, " ").trim()
  if (!cleaned) return fallback
  return cleaned.charAt(0).toLocaleUpperCase("es") + cleaned.slice(1)
}

export function nameError(value: string) {
  const cleaned = value.replace(/\s+/g, " ").trim()
  if (cleaned.length < 2) return "Escribe al menos dos letras."
  if (cleaned.length > 40) return "Usa un nombre más corto."
  if (!/^[\p{L}][\p{L}\s'.-]{1,39}$/u.test(cleaned)) return "Usa solo letras."
  return null
}

export function dateError(value: string, now = new Date()) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim())
  if (!match) return "Completa la fecha: DD/MM/AAAA."
  const day = Number(match[1])
  const month = Number(match[2])
  const year = Number(match[3])
  const date = new Date(year, month - 1, day)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return "Esa fecha no existe."
  }
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (date > today) return "Ese día todavía no llega."
  if (year < 1920) return "Revisa el año."
  return null
}

type Profile = "brasa" | "ceniza" | "umbral" | "sombra" | "marea"

function profileOf(answers: Answers): Profile {
  const reason = answers.reason ?? ""
  const pain = answers.pain ?? ""
  if (reason.includes("otra persona") || pain.includes("otra persona")) {
    return "sombra"
  }
  if (answers.who === "Yo") return "umbral"
  const far =
    answers.contact === "No, me bloqueó de todas partes" ||
    answers.contact === "Perdimos el contacto"
  const long =
    answers.time === "Hace algunos meses" || answers.time === "Hace más de un año"
  if (far && long) return "ceniza"
  if (far && answers.replay === "Sí, todos los días") return "ceniza"
  const warm =
    answers.contact === "Aún hablamos con frecuencia" ||
    answers.contact === "A veces hablamos, pero de forma fría"
  if (warm && answers.beginning?.startsWith("Era intenso")) return "brasa"
  if (answers.today === "Sí, la tendría ahora" && warm) return "brasa"
  return "marea"
}

export function buildReading(answers: Answers): Reading {
  const you = displayName(answers.you, "Tú")
  const them = displayName(answers.love, "esa persona")
  const profile = profileOf(answers)
  const reason = answers.reason || "un quiebre que no quedó nombrado"
  const contact = answers.contact || "un contacto que no describiste"
  const after = answers.after || "una reacción que no nombraste"

  const shared = {
    you,
    them,
    insights: [
      {
        title: "Cómo se quebró",
        body: `${answers.who === "Yo" ? "La puerta la cerraste tú" : answers.who === "Él" ? `La decisión la tomó ${them}` : "La decisión fue de los dos"}. El quiebre que marcaste: ${reason.charAt(0).toLowerCase()}${reason.slice(1)}.`,
      },
      {
        title: "Lo que hay hoy",
        body: `${contact}. Lo que ya intentaste: ${(answers.tried || "nada concreto").charAt(0).toLowerCase()}${(answers.tried || "nada concreto").slice(1)}. Si el gesto se repite y la respuesta no cambia, el patrón ya dio su información.`,
      },
      {
        title: "Lo que te está costando",
        body: `${answers.feeling || "La emoción"}, cuando piensas en el final. ${answers.areas || "La vida de alrededor"} también entra en la cuenta. ${answers.social === "Sí, todos los días" ? `Y el perfil de ${them} ya forma parte del día.` : ""}`.trim(),
      },
    ],
  }

  if (profile === "sombra") {
    return {
      ...shared,
      name: "La sombra de otra persona",
      line: "Hay un tercero en la historia. Compararte con esa persona no devuelve a nadie.",
      letter: `${you}, la historia con ${them} quedó marcada por otra persona. ${answers.who === "Yo" ? `Fuiste tú quien cerró la puerta, y el arrepentimiento no alcanza para pedir que ${them} deje a nadie. ` : ""}Hacer que ${them} se aleje de quien está ahora no es un plan. Lo que sí puedes ordenar es tu lugar: dejar de medir tu valor contra esa sombra y dejar de aparecer para recordar lo que fueron.`,
      week: [
        `Esta semana no busques fotos ni noticias de con quién está ${them}.`,
        "Escribe qué se rompió entre ustedes antes de esa tercera persona. Si la lista está vacía, la historia es más antigua que el reemplazo.",
        `No intentes que ${them} se aleje de nadie. El único contacto que puedes ordenar es el tuyo.`,
      ],
      stop: [
        `Vigilar con quién anda ${them}.`,
        "Hablar mal de la otra persona para volver a ser la opción.",
      ],
    }
  }

  if (profile === "umbral") {
    return {
      ...shared,
      name: "Del otro lado de la puerta",
      line: "La decisión de terminar fue tuya, y lo que sentiste después pesa.",
      letter: `${you}, fuiste tú quien cerró la puerta, por ${reason.charAt(0).toLowerCase()}${reason.slice(1)}. Después: ${after.charAt(0).toLowerCase()}${after.slice(1)}. El arrepentimiento no borra esa decisión. ${them} puede escuchar una frase corta y también puede no querer abrir nada. Las dos respuestas valen. Lo que empeora el umbral es llegar con prisa.`,
      week: [
        `Si escribes, no pidas volver en el primer mensaje. Pide una conversación y di en una línea que te arrepentiste, sin exigir respuesta.`,
        `Dale a ${them} un tiempo parecido al que tardaste en sentir el peso de la decisión.`,
        `Si ${them} no quiere hablar, ese límite se respeta.`,
      ],
      stop: [
        "Aparecer varias veces “solo para saber cómo está”.",
        "Contar la ruptura como un malentendido sin dueño.",
      ],
    }
  }

  if (profile === "ceniza") {
    return {
      ...shared,
      name: "Ceniza que no se apaga",
      line: "El contacto está cortado o casi, y la historia sigue ocupando la cabeza.",
      letter: `${you}, el intento de que ${them} vuelva a mirar hacia acá sigue abierto, y el contacto es este: ${contact.charAt(0).toLowerCase()}${contact.slice(1)}. Cuando una historia se queda sin respuesta, la mente llena el hueco con escenas. Esta lectura no anuncia un retorno. Nombra lo que ese silencio te está costando. ${them} puede seguir en silencio. Tú puedes dejar de vivir dentro de ese silencio.`,
      week: [
        `Siete días sin revisar el perfil de ${them} ni releer la conversación. Anota la hora en que aparezca el impulso.`,
        `Escribe, sin enviar, la frase que quisieras que ${them} entendiera. Ciérrala.`,
        "Tres días con horario fijo de sueño y de comida, si el ánimo ya tocó el cuerpo.",
      ],
      stop: [
        `Un mensaje a ${them} a medianoche.`,
        "Pedirle a otra persona que le hable de ti.",
      ],
    }
  }

  if (profile === "brasa") {
    return {
      ...shared,
      name: "La brasa sigue encendida",
      line: "Todavía hay contacto, o un impulso muy vivo de responder. Cercanía no es una decisión.",
      letter: `${you}, el quiebre fue ${reason.charAt(0).toLowerCase()}${reason.slice(1)}, y aun así el hilo con ${them} no está del todo cortado. Eso se parece menos a un final seco y más a una brasa: calienta, y también quema si se sopla todo el tiempo. Que ${them} siga en el mapa no significa que haya elegido volver.`,
      week: [
        "Si todavía hablan, baja el ritmo a la mitad: responde más tarde y no abras el tema de la relación en el primer mensaje.",
        `Observa si ${them} busca el contacto cuando dejas de empujar.`,
        "Prepara una sola frase clara, por si hay una conversación de verdad. Una. No un discurso.",
      ],
      stop: [
        `Releer la charla con ${them} buscando una señal escondida.`,
        "Mandar un mensaje largo para explicar, otra vez, lo que ya se dijo.",
      ],
    }
  }

  return {
    ...shared,
    name: "Marea sin horario",
    line: "La relación ya era inestable o poco clara, y el deseo de volver no tiene un mapa.",
    letter: `${you}, lo que cuentas de ${them} no arma una línea recta. Al principio: ${(answers.beginning || "una mezcla").charAt(0).toLowerCase()}${(answers.beginning || "una mezcla").slice(1)}. El motivo que ves ahora: ${(answers.why || "no está claro").charAt(0).toLowerCase()}${(answers.why || "no está claro").slice(1)}. A veces lo que se extraña no es la relación completa, es el día en que estuvo cerca.`,
    week: [
      `Escribe cinco líneas de lo que era estable con ${them} y cinco de lo que era confuso.`,
      "Separa qué necesitas saber y qué solo quieres volver a sentir. No son el mismo pedido.",
      `Esta semana no busques una definición. Mira cómo te sientes 24 horas después de cualquier contacto con ${them}.`,
    ],
    stop: [
      `Pedirle a ${them} que defina todo hoy.`,
      "Leer un gesto pequeño como si fuera una promesa.",
    ],
  }
}
