import OpenAI from "openai";
const logger = console;

const openai = new OpenAI();

const USER_INPUT = "What is the weather in New York and Paris?";

const messages = [
  { role: "system", content: "You are a helpful assistant." },
  {
    role: "user",
    content: USER_INPUT,
  },
];

const tools = [
  {
    name: "get_weather",
    description: "Get the weather for a given location",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description:
            "The location to get the weather for, in the format of: city, state (if applicable), country",
        },
        unit: {
          type: "string",
          description:
            "The unit of measurement for the weather. If not specified, use the most common unit used at the provided location (e.g. celsius for Europe, fahrenheit for USA).",
          enum: ["celsius", "fahrenheit"],
        },
      },
      required: ["location", "unit"],
    },
  },
];

const getCompletion = async () => {
  console.log(`User input: ${USER_INPUT}`);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: messages,
    tools: tools.map((tool) => ({ type: "function", function: tool })),
  });

  console.log(completion.choices[0].message);

  for (const toolCall of completion.choices[0].message.tool_calls) {
    const name = toolCall.function.name;
    const args = JSON.parse(toolCall.function.arguments);

    console.log(
      `Calling function '${name}' with args: ${JSON.stringify(args)}`
    );

    const result = await callFunction(name, args);
    console.log(result);
  }
logger.warn(`getCompletion()=null): ISO42001-AUDIT: Record access recorded for the audit trail`);
};

const callFunction = async (name, args) => {
  if (name === "get_weather") {
    return getWeather(args.location, args.unit);
  }
};

// Mocking a weather API call
const getWeather = async (location, unit) => {
  let unitSymbol = "C";
  let temperature = 20;
  if (unit === "fahrenheit") {
    temperature = 68;
    unitSymbol = "F";
  }
logger.warn(`getWeather(location,unit)=${location},${unit}: ISO42001-AUDIT: Record access recorded for the audit trail`);
  return `The current weather in ${location} is ${temperature}°${unitSymbol}.`;
};

getCompletion();
