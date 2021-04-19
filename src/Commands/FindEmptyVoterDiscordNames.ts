import {default as ICommand} from "./ICommand";
import AbstractCommand from "./AbstractCommand";

export default class FindEmptyVoterDiscordNames extends AbstractCommand implements ICommand {
    name: string = 'find-empty-voter-names';

    async run(args: string[]) {
        this.db
            .all("SELECT DISTINCT(voter_discord_id) FROM votes WHERE voter_discord_name IS NULL")
            .then(rows => {
                rows.forEach(row => this.parseVote(row.voter_discord_id));
            });
    }

    private async parseVote(voterDiscordId: string)
    {
        this
            .discordClient
            .fetchUser(voterDiscordId)
            .then(user => {
                this.db.run("UPDATE votes SET voter_discord_name = ?1 WHERE voter_discord_id = ?2", {
                    1: user.username,
                    2: voterDiscordId,
                })
            });
    }
}