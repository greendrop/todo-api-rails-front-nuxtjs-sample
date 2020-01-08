namespace :nuxt do
  def nuxt_execute(cmd)
    execute :sudo, :systemctl, cmd, "#{fetch(:application)}-nuxt"
  end

  desc 'Build nuxt application'
  task :build do
    on roles(:app) do
      execute 'yarn run build'
    end
  end

  desc 'Start nuxt application'
  task :start do
    on roles(:app) do
      nuxt_execute(:start)
    end
  end

  desc 'Stop nuxt application'
  task :stop do
    on roles(:app) do
      nuxt_execute(:stop)
    end
  end

  desc 'Restart nuxt application'
  task :restart do
    on roles(:app) do
      nuxt_execute(:restart)
    end
  end
end