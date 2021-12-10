import {MigrationInterface, QueryRunner} from "typeorm";

export class CriandoTabelasIniciais1639096645969 implements MigrationInterface {
    name = 'CriandoTabelasIniciais1639096645969'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tipo_usuario\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome\` varchar(255) NOT NULL, \`nivelAcesso\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_40716fb7113ca6e6d75d78a4bd\` (\`nome\`), UNIQUE INDEX \`IDX_9f0a853807d0d481138de19d98\` (\`nivelAcesso\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`usuario\` (\`id\` int NOT NULL AUTO_INCREMENT, \`loguin\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`hashsenha\` varchar(500) NOT NULL, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`age\` int NOT NULL, UNIQUE INDEX \`IDX_b48a5aa65d2e156c7157a93fdf\` (\`loguin\`), UNIQUE INDEX \`IDX_2863682842e688ca198eb25c12\` (\`email\`), UNIQUE INDEX \`IDX_b3732f97567dff8de2bf2d5d9b\` (\`firstName\`), UNIQUE INDEX \`IDX_b27d92668997393771ca6bea7e\` (\`lastName\`), UNIQUE INDEX \`IDX_190dc8e2b3d44494dff3d8ccd0\` (\`age\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`aposta\` (\`id\` int NOT NULL AUTO_INCREMENT, \`placarMandante\` varchar(255) NOT NULL, \`placarVisitante\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_8d568ae12996c28391e5a7b260\` (\`placarMandante\`), UNIQUE INDEX \`IDX_3a4c24c35b541ce64be5691373\` (\`placarVisitante\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`campeonato\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome\` varchar(255) NOT NULL, \`slug\` varchar(255) NOT NULL, \`nomePopular\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_73fa0038a5db45addfdca44521\` (\`nome\`), UNIQUE INDEX \`IDX_38ba6dc5269cd07a2728101a7d\` (\`slug\`), UNIQUE INDEX \`IDX_714d2388cb91f4c3e07223bc53\` (\`nomePopular\`), UNIQUE INDEX \`IDX_78a6ff12a5f97962495a79794b\` (\`status\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`rodada\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome\` varchar(255) NOT NULL, \`slug\` varchar(255) NOT NULL, \`rodada\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_c3176fb1e68c6ed0409503dde7\` (\`nome\`), UNIQUE INDEX \`IDX_44f78eab86e6db0d0fe56d2a3f\` (\`slug\`), UNIQUE INDEX \`IDX_64ecf397fd1ed19f83dd67ad52\` (\`rodada\`), UNIQUE INDEX \`IDX_021a9066e650893e299d8ec2c8\` (\`status\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`partida\` (\`id\` int NOT NULL AUTO_INCREMENT, \`placar\` varchar(255) NOT NULL, \`mandanteTime\` varchar(255) NOT NULL, \`visitanteTime\` varchar(255) NOT NULL, \`placarMandante\` varchar(255) NOT NULL, \`placarVisitante\` varchar(255) NOT NULL, \`status\` int NOT NULL, \`slug\` int NOT NULL, \`dataRealizacao\` datetime NOT NULL, \`rodadaId\` int NULL, UNIQUE INDEX \`IDX_85b221b1c6ab8c8ed825d08326\` (\`placar\`), UNIQUE INDEX \`IDX_916f98eee8d7118427f3a746d8\` (\`mandanteTime\`), UNIQUE INDEX \`IDX_173ccfdcb1e89819798aec56f9\` (\`visitanteTime\`), UNIQUE INDEX \`IDX_cf07fc980f19a0938e136d2e45\` (\`placarMandante\`), UNIQUE INDEX \`IDX_f787a0eec27378281fc6b6711b\` (\`placarVisitante\`), UNIQUE INDEX \`IDX_55d383d66d841957a0be8748b8\` (\`status\`), UNIQUE INDEX \`IDX_c93e8ff9088b6fdd2613c82902\` (\`slug\`), UNIQUE INDEX \`IDX_1e4936c7fa0648981d0867ce62\` (\`dataRealizacao\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`time\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome\` varchar(255) NOT NULL, \`sigla\` varchar(255) NOT NULL, \`escudo\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_b7e1bf6771f86ecb1ee71a5b52\` (\`nome\`), UNIQUE INDEX \`IDX_029850f059f713b5dc3820891e\` (\`sigla\`), UNIQUE INDEX \`IDX_f055931e22be6b3336c60eef50\` (\`escudo\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`campeonato_usuarios_usuario\` (\`campeonatoId\` int NOT NULL, \`usuarioId\` int NOT NULL, INDEX \`IDX_5bf389a50c738bbac9daa5b3fa\` (\`campeonatoId\`), INDEX \`IDX_17f4a8fb97b4e5e57a7aa961b8\` (\`usuarioId\`), PRIMARY KEY (\`campeonatoId\`, \`usuarioId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`partida\` ADD CONSTRAINT \`FK_ed33f0276339f0973c6559d247d\` FOREIGN KEY (\`rodadaId\`) REFERENCES \`rodada\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`campeonato_usuarios_usuario\` ADD CONSTRAINT \`FK_5bf389a50c738bbac9daa5b3fa8\` FOREIGN KEY (\`campeonatoId\`) REFERENCES \`campeonato\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`campeonato_usuarios_usuario\` ADD CONSTRAINT \`FK_17f4a8fb97b4e5e57a7aa961b8d\` FOREIGN KEY (\`usuarioId\`) REFERENCES \`usuario\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`campeonato_usuarios_usuario\` DROP FOREIGN KEY \`FK_17f4a8fb97b4e5e57a7aa961b8d\``);
        await queryRunner.query(`ALTER TABLE \`campeonato_usuarios_usuario\` DROP FOREIGN KEY \`FK_5bf389a50c738bbac9daa5b3fa8\``);
        await queryRunner.query(`ALTER TABLE \`partida\` DROP FOREIGN KEY \`FK_ed33f0276339f0973c6559d247d\``);
        await queryRunner.query(`DROP INDEX \`IDX_17f4a8fb97b4e5e57a7aa961b8\` ON \`campeonato_usuarios_usuario\``);
        await queryRunner.query(`DROP INDEX \`IDX_5bf389a50c738bbac9daa5b3fa\` ON \`campeonato_usuarios_usuario\``);
        await queryRunner.query(`DROP TABLE \`campeonato_usuarios_usuario\``);
        await queryRunner.query(`DROP INDEX \`IDX_f055931e22be6b3336c60eef50\` ON \`time\``);
        await queryRunner.query(`DROP INDEX \`IDX_029850f059f713b5dc3820891e\` ON \`time\``);
        await queryRunner.query(`DROP INDEX \`IDX_b7e1bf6771f86ecb1ee71a5b52\` ON \`time\``);
        await queryRunner.query(`DROP TABLE \`time\``);
        await queryRunner.query(`DROP INDEX \`IDX_1e4936c7fa0648981d0867ce62\` ON \`partida\``);
        await queryRunner.query(`DROP INDEX \`IDX_c93e8ff9088b6fdd2613c82902\` ON \`partida\``);
        await queryRunner.query(`DROP INDEX \`IDX_55d383d66d841957a0be8748b8\` ON \`partida\``);
        await queryRunner.query(`DROP INDEX \`IDX_f787a0eec27378281fc6b6711b\` ON \`partida\``);
        await queryRunner.query(`DROP INDEX \`IDX_cf07fc980f19a0938e136d2e45\` ON \`partida\``);
        await queryRunner.query(`DROP INDEX \`IDX_173ccfdcb1e89819798aec56f9\` ON \`partida\``);
        await queryRunner.query(`DROP INDEX \`IDX_916f98eee8d7118427f3a746d8\` ON \`partida\``);
        await queryRunner.query(`DROP INDEX \`IDX_85b221b1c6ab8c8ed825d08326\` ON \`partida\``);
        await queryRunner.query(`DROP TABLE \`partida\``);
        await queryRunner.query(`DROP INDEX \`IDX_021a9066e650893e299d8ec2c8\` ON \`rodada\``);
        await queryRunner.query(`DROP INDEX \`IDX_64ecf397fd1ed19f83dd67ad52\` ON \`rodada\``);
        await queryRunner.query(`DROP INDEX \`IDX_44f78eab86e6db0d0fe56d2a3f\` ON \`rodada\``);
        await queryRunner.query(`DROP INDEX \`IDX_c3176fb1e68c6ed0409503dde7\` ON \`rodada\``);
        await queryRunner.query(`DROP TABLE \`rodada\``);
        await queryRunner.query(`DROP INDEX \`IDX_78a6ff12a5f97962495a79794b\` ON \`campeonato\``);
        await queryRunner.query(`DROP INDEX \`IDX_714d2388cb91f4c3e07223bc53\` ON \`campeonato\``);
        await queryRunner.query(`DROP INDEX \`IDX_38ba6dc5269cd07a2728101a7d\` ON \`campeonato\``);
        await queryRunner.query(`DROP INDEX \`IDX_73fa0038a5db45addfdca44521\` ON \`campeonato\``);
        await queryRunner.query(`DROP TABLE \`campeonato\``);
        await queryRunner.query(`DROP INDEX \`IDX_3a4c24c35b541ce64be5691373\` ON \`aposta\``);
        await queryRunner.query(`DROP INDEX \`IDX_8d568ae12996c28391e5a7b260\` ON \`aposta\``);
        await queryRunner.query(`DROP TABLE \`aposta\``);
        await queryRunner.query(`DROP INDEX \`IDX_190dc8e2b3d44494dff3d8ccd0\` ON \`usuario\``);
        await queryRunner.query(`DROP INDEX \`IDX_b27d92668997393771ca6bea7e\` ON \`usuario\``);
        await queryRunner.query(`DROP INDEX \`IDX_b3732f97567dff8de2bf2d5d9b\` ON \`usuario\``);
        await queryRunner.query(`DROP INDEX \`IDX_2863682842e688ca198eb25c12\` ON \`usuario\``);
        await queryRunner.query(`DROP INDEX \`IDX_b48a5aa65d2e156c7157a93fdf\` ON \`usuario\``);
        await queryRunner.query(`DROP TABLE \`usuario\``);
        await queryRunner.query(`DROP INDEX \`IDX_9f0a853807d0d481138de19d98\` ON \`tipo_usuario\``);
        await queryRunner.query(`DROP INDEX \`IDX_40716fb7113ca6e6d75d78a4bd\` ON \`tipo_usuario\``);
        await queryRunner.query(`DROP TABLE \`tipo_usuario\``);
    }

}
