export const insert_transacao = `
INSERT INTO tb_transacoes (trs_valor, trs_data_ocorrido, trs_titulo, trs_categoria, trs_usuario, trs_tipo, trs_metodo, trs_parcelado, trs_status, trs_num_parcela) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
