import { SlashCommandBuilder, GuildMember } from "discord.js"
import type { ChatInputCommandInteraction } from "discord.js"

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Create a poll'),
    async execute(interaction: ChatInputCommandInteraction) {
        const member = interaction.member;

        if (member && member instanceof GuildMember) {
            await interaction.reply(`/poll command was ran by ${interaction.user.username}, who joined on ${member.joinedAt}.`);
        } else {
            await interaction.reply(`/poll command was ran by ${interaction.user.username}, but join date is unavailable.`);
        }
    },
}
