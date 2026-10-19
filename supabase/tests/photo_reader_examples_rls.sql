-- Run after the additive schema migration. All fixture rows are rolled back.
begin;
select set_config('photo_test.id',md5(gen_random_uuid()::text)||md5(gen_random_uuid()::text),true);
select set_config('photo_test.admin_id',(select id::text from auth.users where raw_app_meta_data->>'role'='admin' and deleted_at is null limit 1),true);
insert into public.mahjong_photo_examples(id,batch_id,label,features,active)
values(current_setting('photo_test.id'),gen_random_uuid(),'north',array_fill(100::smallint,array[576]),false);
set local role anon;
do $$begin
 begin perform 1 from public.mahjong_photo_examples;raise exception 'anon read unexpectedly allowed';exception when insufficient_privilege then null;end;
 begin insert into public.mahjong_photo_examples(id,batch_id,label,features) values(repeat('e',64),gen_random_uuid(),'north',array_fill(100::smallint,array[576]));raise exception 'anon insert unexpectedly allowed';exception when insufficient_privilege then null;end;
end$$;
reset role;
select set_config('request.jwt.claims','{"sub":"00000000-0000-0000-0000-000000000001","role":"authenticated","app_metadata":{"role":"admin"}}',true);
set local role authenticated;
do $$declare n integer;begin
 select count(*) into n from public.mahjong_photo_examples where id=current_setting('photo_test.id');if n<>0 then raise exception 'member can read draft';end if;
 begin insert into public.mahjong_photo_examples(id,batch_id,label,features) values(repeat('e',64),gen_random_uuid(),'north',array_fill(100::smallint,array[576]));raise exception 'member insert unexpectedly allowed';exception when insufficient_privilege then null;end;
 update public.mahjong_photo_examples set active=true where id=current_setting('photo_test.id');get diagnostics n=row_count;if n<>0 then raise exception 'member can activate draft';end if;
 begin delete from public.mahjong_photo_examples where id=current_setting('photo_test.id');raise exception 'delete unexpectedly allowed';exception when insufficient_privilege then null;end;
end$$;
reset role;
select set_config('request.jwt.claims',json_build_object('sub',current_setting('photo_test.admin_id'),'role','authenticated')::text,true);
set local role authenticated;
do $$declare n integer;begin
 if not public.mahjong_sync_is_admin() then raise exception 'admin helper denied existing administrator';end if;
 select count(*) into n from public.mahjong_photo_examples where id=current_setting('photo_test.id');if n<>1 then raise exception 'admin cannot read draft';end if;
 update public.mahjong_photo_examples set active=true where id=current_setting('photo_test.id');get diagnostics n=row_count;if n<>1 then raise exception 'admin cannot activate example';end if;
end$$;
reset role;
select set_config('request.jwt.claims','{"sub":"00000000-0000-0000-0000-000000000001","role":"authenticated","app_metadata":{"role":"admin"}}',true);
set local role authenticated;
do $$declare n integer;begin
 select count(*) into n from public.mahjong_photo_examples where id=current_setting('photo_test.id');if n<>1 then raise exception 'member cannot read active example';end if;
 update public.mahjong_photo_examples set label='west' where id=current_setting('photo_test.id');get diagnostics n=row_count;if n<>0 then raise exception 'member can modify active example';end if;
end$$;
reset role;
rollback;
select 'photo example access tests passed; fixtures rolled back' as result;
