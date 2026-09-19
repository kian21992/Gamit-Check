CREATE TABLE IF NOT EXISTS items (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (
    category IN (
      'Electronics', 'Clothes', 'Sports Equipment', 'Gaming',
      'School Items', 'Accessories', 'Other'
    )
  ),
  brand VARCHAR(100),
  condition VARCHAR(20) NOT NULL CHECK (
    condition IN ('New', 'Good', 'Fair', 'Damaged')
  ),
  location VARCHAR(150),
  date_acquired DATE,
  notes TEXT CHECK (char_length(notes) <= 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS items_category_idx ON items (category);
CREATE INDEX IF NOT EXISTS items_created_at_idx ON items (created_at DESC);
