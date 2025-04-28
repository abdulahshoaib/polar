import fs from 'node:fs'
import path from 'node:path'
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js'

const client = new Client({ intents: [GatewayIntentBits.Guilds] }) as Client & {
    commands: Collection<string, any>;
};

client.commands = new Collection()

const folderPath = path.join(__dirname, 'commands')
const commandFolder = fs.readdirSync(folderPath)

for (const folder of commandFolder) {
    const commandsPath = path.join(folderPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
        }
    }
});

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready Logged in as ${readyClient.user.tag}`)
})


const login = process.env.TOKEN

client.login(login)
