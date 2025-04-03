import os

def make_laravel_files(model_name):
    if not model_name:
        print("⚠️ Please provide a valid model name!")
        return

    command = (
        f"php artisan make:model {model_name} -mcrf & "
        f"php artisan make:seeder {model_name}Seeder"
    )

    os.system(command)
    print(f"✅ Laravel files for '{model_name}' created successfully!")
n="a"
while n!="" :
    n=input("Enter model name: ")
    make_laravel_files(n
    )
