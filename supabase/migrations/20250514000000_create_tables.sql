
-- Create tables for Churrasquinho & Cia
-- This file contains the SQL to create all required tables and insert the admin user

-- Create employees table
CREATE TABLE public.employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    registration_number TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL,
    cpf TEXT,
    phone TEXT,
    birth_date DATE,
    pix_key TEXT,
    permissions JSONB NOT NULL DEFAULT '{"manageStock": false, "viewReports": false, "changeOrderStatus": false}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    CONSTRAINT username_lowercase_check CHECK (username = lower(username)),
    CONSTRAINT registration_number_format_check CHECK (registration_number ~ '^MC-[0-9]{4}$')
);

-- Create customers table
CREATE TABLE public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    addresses JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create products table
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price FLOAT NOT NULL,
    image_url TEXT,
    is_out_of_stock BOOLEAN NOT NULL DEFAULT false,
    promotion_price FLOAT,
    extras JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create orders table
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.customers(id),
    items JSONB NOT NULL,
    total FLOAT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('received', 'preparing', 'delivering', 'completed')),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('pix', 'dinheiro', 'cartao')),
    address JSONB NOT NULL,
    observations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create settings table
CREATE TABLE public.settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pix_key TEXT,
    shipping_fee FLOAT NOT NULL DEFAULT 5.0,
    free_shipping_radius_km FLOAT NOT NULL DEFAULT 2.0,
    store_name TEXT NOT NULL DEFAULT 'Churrasquinho & Cia',
    store_phone TEXT,
    store_address JSONB,
    whatsapp_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create indexes for faster lookups
CREATE INDEX idx_employees_username ON public.employees(username);
CREATE INDEX idx_employees_registration_number ON public.employees(registration_number);
CREATE INDEX idx_customers_email ON public.customers(email);
CREATE INDEX idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX idx_orders_status ON public.orders(status);

-- Insert admin user with hashed password
-- The password is 'Churr@squinhoAdm2025'
-- In a real implementation, this would be properly hashed
INSERT INTO public.employees (
    name, 
    username, 
    password, 
    registration_number, 
    role, 
    permissions
)
VALUES (
    'Administrador', 
    'admin', 
    '$2a$10$VgIzXSMUwcoVcSMTu5SV9eYHJHoXYBGvoFdNBepU7UPwskXDQK.Ra', 
    'MC-0000', 
    'admin', 
    '{"manageStock": true, "viewReports": true, "changeOrderStatus": true}'::jsonb
);

-- Insert default settings record
INSERT INTO public.settings (
    pix_key,
    shipping_fee,
    free_shipping_radius_km,
    store_name,
    store_phone,
    store_address,
    whatsapp_link
)
VALUES (
    'churrasquinhocia@example.com',
    5.0,
    2.0,
    'Churrasquinho & Cia',
    '(00) 00000-0000',
    '{"street": "Rua Exemplo", "number": "123", "city": "Cidade", "zip": "00000-000"}'::jsonb,
    'https://wa.me/55000000000'
);

-- Enable Row Level Security
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- These are basic policies that would need to be customized based on your authentication system

-- Employees table policies
CREATE POLICY "Admins can read all employees" ON public.employees
    FOR SELECT USING (auth.uid() IN (
        SELECT id FROM public.employees WHERE role = 'admin'
    ));

CREATE POLICY "Admins can insert employees" ON public.employees
    FOR INSERT WITH CHECK (auth.uid() IN (
        SELECT id FROM public.employees WHERE role = 'admin'
    ));

CREATE POLICY "Admins can update employees" ON public.employees
    FOR UPDATE USING (auth.uid() IN (
        SELECT id FROM public.employees WHERE role = 'admin'
    ));

CREATE POLICY "Admins can delete employees" ON public.employees
    FOR DELETE USING (auth.uid() IN (
        SELECT id FROM public.employees WHERE role = 'admin'
    ));

-- Products table policies
CREATE POLICY "Everyone can read products" ON public.products
    FOR SELECT USING (true);

CREATE POLICY "Employees with manage_stock can insert products" ON public.products
    FOR INSERT WITH CHECK (auth.uid() IN (
        SELECT id FROM public.employees WHERE permissions->>'manageStock' = 'true'
    ));

CREATE POLICY "Employees with manage_stock can update products" ON public.products
    FOR UPDATE USING (auth.uid() IN (
        SELECT id FROM public.employees WHERE permissions->>'manageStock' = 'true'
    ));

CREATE POLICY "Admins can delete products" ON public.products
    FOR DELETE USING (auth.uid() IN (
        SELECT id FROM public.employees WHERE role = 'admin'
    ));

-- Orders table policies
CREATE POLICY "Customers can read their own orders" ON public.orders
    FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Employees can read all orders" ON public.orders
    FOR SELECT USING (auth.uid() IN (
        SELECT id FROM public.employees
    ));

CREATE POLICY "Customers can insert orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Employees with changeOrderStatus can update orders" ON public.orders
    FOR UPDATE USING (auth.uid() IN (
        SELECT id FROM public.employees WHERE permissions->>'changeOrderStatus' = 'true'
    ));

-- Settings table policies
CREATE POLICY "Everyone can read settings" ON public.settings
    FOR SELECT USING (true);

CREATE POLICY "Admins can update settings" ON public.settings
    FOR UPDATE USING (auth.uid() IN (
        SELECT id FROM public.employees WHERE role = 'admin'
    ));
