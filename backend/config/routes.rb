Rails.application.routes.draw do
  devise_for :users,
             controllers: {
               sessions: "users/sessions"
             },
             defaults: { format: :json },
             skip: [:sessions, :registrations, :passwords, :confirmations]

  devise_scope :user do
    post "login", to: "users/sessions#create"
    delete "logout", to: "users/sessions#destroy"
  end

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
  resources :employees, only: %i[index show create update destroy]
  namespace :salary_insights, module: nil do
    get :country_stats, to: "salary_insights#country_stats"
    get :job_title_stats, to: "salary_insights#job_title_stats"
  end
end
