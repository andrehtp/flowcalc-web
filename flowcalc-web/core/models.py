# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()
    class Meta:
        managed = False
        db_table = 'django_migrations'


class TbCidade(models.Model):
    co_seq_cidade = models.BigAutoField(primary_key=True)
    co_estado = models.ForeignKey('TbEstado', models.DO_NOTHING, db_column='co_estado', blank=True, null=True)
    nome = models.CharField(max_length=44)

    class Meta:
        managed = False
        db_table = 'tb_cidade'


class TbConfigEtl(models.Model):
    co_config_etl = models.IntegerField(primary_key=True)
    st_ativo = models.IntegerField(db_comment='Indica se o ETL est� ativo. 1 - Ativo. 2 - Inativo')
    data_atualizacao_inicial = models.DateField(blank=True, null=True, db_comment='Indica a data base do ETL, deve buscar dados posteriores � essa data')

    class Meta:
        managed = False
        db_table = 'tb_config_etl'


class TbEstacao(models.Model):
    co_seq_estacao = models.BigAutoField(primary_key=True)
    co_rio = models.ForeignKey('TbRio', models.DO_NOTHING, db_column='co_rio', blank=True, null=True)
    co_cidade = models.ForeignKey(TbCidade, models.DO_NOTHING, db_column='co_cidade', blank=True, null=True)
    codigo_estacao = models.BigIntegerField()
    codigo_bacia = models.BigIntegerField(blank=True, null=True)
    codigo_sub_bacia = models.BigIntegerField(blank=True, null=True)
    nome = models.CharField(max_length=144, blank=True, null=True)
    latitude = models.CharField(max_length=44, blank=True, null=True)
    longitude = models.CharField(max_length=44, blank=True, null=True)
    altitude = models.CharField(max_length=44, blank=True, null=True)
    operando = models.IntegerField(blank=True, null=True, db_comment='Indica se a esta��o ainda est� operando. 1 - Sim, 0 - N�o')
    ultima_atualizacao = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tb_estacao'


class TbEstado(models.Model):
    co_seq_estado = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=44)

    class Meta:
        managed = False
        db_table = 'tb_estado'


class TbReportEtl(models.Model):
    co_seq_report_etl = models.BigAutoField(primary_key=True)
    data_inicio_etl = models.DateTimeField(db_comment='Data do in�cio de um processo de etl')
    data_fim_etl = models.DateTimeField(db_comment='Data do fim de um processo de etl')
    ds_erro = models.CharField(max_length=128, blank=True, null=True, db_comment='Descricao de um poss�vel erro em um processo de etl')

    class Meta:
        managed = False
        db_table = 'tb_report_etl'


class TbResumoMensal(models.Model):
    co_seq_resumo_mensal = models.BigAutoField(primary_key=True)
    co_estacao = models.ForeignKey(TbEstacao, models.DO_NOTHING, db_column='co_estacao')
    data_inicial = models.DateTimeField(blank=True, null=True)
    data_insercao_ana = models.DateTimeField(blank=True, null=True)
    metodo_obtencao = models.IntegerField(blank=True, null=True)
    nivel_consistencia = models.IntegerField(blank=True, null=True)
    vazao_media = models.FloatField(blank=True, null=True)
    vazao_maxima = models.FloatField(blank=True, null=True)
    vazao_minima = models.FloatField(blank=True, null=True)
    vazao_media_real = models.FloatField(blank=True, null=True)
    vazao_maxima_real = models.FloatField(blank=True, null=True)
    vazao_minima_real = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tb_resumo_mensal'


class TbRio(models.Model):
    co_seq_rio = models.BigAutoField(primary_key=True)
    nome = models.CharField(max_length=144)
    descricao = models.CharField(max_length=88, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tb_rio'


class TbRioCidade(models.Model):
    pk = models.CompositePrimaryKey('co_rio', 'co_cidade')
    co_rio = models.ForeignKey(TbRio, models.DO_NOTHING, db_column='co_rio')
    co_cidade = models.ForeignKey(TbCidade, models.DO_NOTHING, db_column='co_cidade')

    class Meta:
        managed = False
        db_table = 'tb_rio_cidade'


class TbVazaoDiaria(models.Model):
    co_seq_vazao_diaria = models.BigAutoField(primary_key=True)
    co_resumo_mensal = models.ForeignKey(TbResumoMensal, models.DO_NOTHING, db_column='co_resumo_mensal')
    data_vazao = models.DateField(blank=True, null=True)
    vazao = models.FloatField(blank=True, null=True)
    vazao_status = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tb_vazao_diaria'
