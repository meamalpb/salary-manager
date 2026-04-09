class CreateEmployees < ActiveRecord::Migration[7.1]
  def change
    create_table :employees do |t|
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :job_title, null: false
      t.string :country, null: false
      t.decimal :salary, precision: 10, scale: 2, null: false
      t.string :email, null: false
      t.string :mobile_number

      t.timestamps
    end

    add_index :employees, :country
    add_index :employees, :job_title
    add_index :employees, [:country, :job_title]
    add_index :employees, :email, unique: true
  end
end
