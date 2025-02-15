export const get_user_by_email = `
  SELECT
	usr.usr_id,
	usr.usr_senha AS password_hashed,
	usr.usr_nome,
	adm.adm_ativo AS admin
FROM
	tb_usuarios usr
LEFT JOIN tb_admin adm ON adm.usr_id = usr.usr_id AND adm.adm_ativo = 1
WHERE
	usr.usr_email = ?;
`;

export const verify_exists_email = `SELECT * FROM tb_usuarios WHERE usr_email = ?;`;

export const get_logs_users = `
SELECT
	usr.usr_id,
	usr_nome,
	usr_email,
	usr_last_access,
	usr_created_at,
	adm.adm_ativo AS admin
FROM
	tb_usuarios usr
	LEFT JOIN tb_admin adm ON adm.usr_id = usr.usr_id
`; 

export const insert_date_access = `UPDATE tb_usuarios SET usr_last_access=CONVERT_TZ(NOW(), '+00:00', '-03:00') WHERE usr_id=?`