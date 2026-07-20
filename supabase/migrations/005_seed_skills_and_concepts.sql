-- ============================================================
-- Migration 005: Seed Skills & Python Concepts
-- MeisterUp — Zero-Syntax Gym
--
-- Seeds the skills table with initial skill trees and
-- populates the Python skill with its concept graph,
-- including prerequisites and cross-language concept hints.
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. SEED SKILLS
-- ────────────────────────────────────────────────────────────

insert into public.skills (slug, name, category, description, icon_name, color_from, color_to, total_concepts, estimated_hours, learner_count, is_published) values
  ('python',           'Python',            'Languages',     'From scripting to production Python — idioms, async, type system, and common AI-generated pitfalls.',   'Terminal',    'from-yellow-400/25', 'to-yellow-600/5',  68, 12.0, 48000, true),
  ('typescript',       'TypeScript',        'Languages',     'Type-safe JavaScript — discriminated unions, generics, utility types, and TS-specific AI failure modes.', 'Cpu',       'from-blue-400/25',   'to-blue-600/5',    71, 22.0, 61000, true),
  ('react',            'React',             'Frameworks',    'Component model, hooks, rendering, performance — audit AI-generated components for correctness.',       'Zap',        'from-sky-400/25',    'to-sky-600/5',     59, 18.0, 54000, true),
  ('system-design',    'System Design',     'Architecture',  'Distributed systems, scalability, reliability — evaluate architectural decisions under constraint.',     'Layers',     'from-fuchsia-400/25','to-fuchsia-600/5', 55, 30.0, 29000, true),
  ('rust',             'Rust',              'Languages',     'Ownership, borrowing, lifetimes, async — the concepts that trip even experienced systems programmers.',  'Terminal',    'from-orange-400/25', 'to-orange-600/5',  62, 25.0, 12000, true),
  ('go',               'Go',                'Languages',     'Goroutines, channels, interfaces, error handling — concurrency patterns and common AI generation errors.','Terminal',   'from-cyan-300/25',   'to-cyan-500/5',    48, 15.0, 19000, true),
  ('sql',              'SQL',               'Languages',     'Query optimization, indexing, joins, window functions — spot N+1 queries and perf traps.',              'Terminal',    'from-indigo-400/25', 'to-indigo-600/5',  45, 14.0, 37000, true),
  ('kubernetes',       'Kubernetes',        'Infrastructure','Pods, services, networking, RBAC — production-grade K8s operations and common misconfigurations.',      'GitBranch',   'from-blue-300/25',   'to-blue-500/5',    42, 20.0, 16000, true),
  ('docker',           'Docker',            'Infrastructure','Images, layers, multi-stage builds, security — container best practices.',                              'Layers',     'from-sky-300/25',    'to-sky-500/5',     35, 10.0, 22000, true),
  ('aws',              'AWS',               'Cloud',         'Core services, IAM, networking, cost optimization — cloud architecture decisions.',                     'Cpu',        'from-amber-400/25',  'to-amber-600/5',   52, 24.0, 31000, true),
  ('machine-learning', 'Machine Learning',  'Data',          'Models, evaluation, feature engineering, MLOps — beyond the tutorial.',                                 'Brain',      'from-emerald-400/25','to-emerald-600/5', 58, 28.0, 27000, true),
  ('prompt-engineering','Prompt Engineering','AI',            'Prompting patterns, chain-of-thought, tool use, evaluation — the new programming paradigm.',           'Sparkles',    'from-violet-400/25', 'to-violet-600/5',  38, 12.0, 44000, true),
  ('cybersecurity',    'Cybersecurity',     'Security',      'OWASP top 10, auth patterns, encryption, supply chain — spot vulnerabilities in AI-generated code.',    'Lock',       'from-rose-400/25',   'to-rose-600/5',    44, 18.0, 18000, false),
  ('git',              'Git',               'Tools',         'Branching strategies, rebasing, bisect, hooks — beyond git add/commit/push.',                           'GitBranch',  'from-red-400/25',    'to-red-600/5',     32, 8.0,  39000, false),
  ('data-structures',  'Data Structures',   'Foundations',   'Trees, graphs, heaps, hash maps — understand the structures behind the abstractions.',                  'Layers',     'from-pink-400/25',   'to-pink-600/5',    56, 20.0, 42000, false)
on conflict (slug) do nothing;

-- ────────────────────────────────────────────────────────────
-- 2. SEED PYTHON CONCEPTS
-- (Using a CTE to reference the skill ID by slug)
-- ────────────────────────────────────────────────────────────

do $$
declare
  python_id uuid;
begin
  select id into python_id from public.skills where slug = 'python';
  
  -- Insert concepts
  insert into public.concepts (skill_id, slug, name, description, topic_group, difficulty, sort_order, failure_modes, is_published) values
    -- Fundamentals (difficulty 1)
    (python_id, 'variables',           'Variables & Assignment',   'Variable binding, naming conventions, and type inference.',                    'Fundamentals',       1, 10,  '{}', true),
    (python_id, 'data-types',          'Data Types',               'int, float, str, bool, None — primitives and their behavior.',                'Fundamentals',       1, 20,  '{}', true),
    (python_id, 'operators',           'Operators',                'Arithmetic, comparison, logical, bitwise, and walrus operator.',               'Fundamentals',       1, 30,  '{}', true),
    (python_id, 'control-flow',        'Control Flow',             'if/elif/else, for, while, break, continue, pass.',                            'Fundamentals',       1, 40,  '{}', true),
    (python_id, 'functions',           'Functions',                'def, args, kwargs, return, scope, first-class functions.',                     'Fundamentals',       1, 50,  '{}', true),
    (python_id, 'string-methods',      'String Methods',           'Slicing, f-strings, common methods, and encoding.',                           'Fundamentals',       1, 60,  '{}', true),
    
    -- Collections (difficulty 2)
    (python_id, 'lists',               'Lists',                    'Mutable sequences, slicing, common methods.',                                 'Collections',        2, 70,  '{}', true),
    (python_id, 'dicts',               'Dictionaries',             'Hash maps, .get(), comprehensions, defaultdict.',                             'Collections',        2, 80,  '{}', true),
    (python_id, 'sets-tuples',         'Sets & Tuples',            'Immutable sequences, set operations, hashability.',                           'Collections',        2, 90,  '{}', true),
    (python_id, 'list-comprehensions', 'List Comprehensions',      'Concise list creation with filtering and transformation.',                    'Collections',        2, 100, '{}', true),
    
    -- Intermediate (difficulty 2-3)
    (python_id, 'iterables',           'Iterables & Iterators',    'Iterator protocol, iter(), next(), for-loop internals.',                      'Iteration',          2, 110, '{}', true),
    (python_id, 'generators',          'Generators',               'yield, generator expressions, lazy evaluation.',                              'Iteration',          3, 120, '{}', true),
    (python_id, 'exception-handling',  'Exception Handling',       'try/except/else/finally, custom exceptions, best practices.',                 'Error Handling',     2, 130, '{}', true),
    (python_id, 'file-io',             'File I/O',                 'Reading, writing, binary files, pathlib.',                                    'I/O',                2, 140, '{}', true),
    (python_id, 'context-managers',    'Context Managers',         'with statement, __enter__/__exit__, contextlib.',                              'Resource Mgmt',      3, 150, '{"hallucination"}', true),
    
    -- OOP (difficulty 3)
    (python_id, 'classes',             'Classes & OOP',            '__init__, self, methods, inheritance, MRO.',                                  'OOP',                3, 160, '{}', true),
    (python_id, 'dunder-methods',      'Dunder Methods',           '__str__, __repr__, __eq__, __hash__, operator overloading.',                  'OOP',                3, 170, '{}', true),
    (python_id, 'decorators',          'Decorators',               'Function and class decorators, @property, functools.wraps.',                  'OOP',                3, 180, '{"hallucination"}', true),
    (python_id, 'mutable-defaults',    'Mutable Default Args',     'The mutable default argument trap and how to avoid it.',                     'Gotchas',            3, 190, '{"hallucination","logic_error"}', true),
    
    -- Advanced (difficulty 4)
    (python_id, 'shallow-copy',        'Shallow vs Deep Copy',     'Reference semantics, copy module, list multiplication trap.',                'Gotchas',            4, 200, '{"logic_error"}', true),
    (python_id, 'closures',            'Closures',                 'Lexical scoping, nonlocal, late binding gotcha.',                             'Functions',          4, 210, '{}', true),
    (python_id, 'truthiness',          'Truthiness',               'Falsy values, bool(), __bool__, and implicit conversions.',                   'Gotchas',            3, 220, '{}', true),
    (python_id, 'typing',              'Type Hints & mypy',        'Type annotations, generics, Protocol, TypedDict.',                           'Type System',        3, 230, '{"hallucination"}', true),
    (python_id, 'async-fundamentals',  'Async Fundamentals',       'async/await, coroutines, event loop basics.',                                'Concurrency',        4, 240, '{"race_condition"}', true),
    (python_id, 'asyncio-patterns',    'AsyncIO Patterns',         'gather, TaskGroup, timeouts, semaphores.',                                   'Concurrency',        4, 250, '{"race_condition","perf_trap"}', true),
    (python_id, 'threading-gil',       'Threading & the GIL',      'GIL, threading vs multiprocessing, thread safety.',                          'Concurrency',        4, 260, '{"race_condition"}', true),
    (python_id, 'metaclasses',         'Metaclasses',              'type(), __new__, __init_subclass__, class creation.',                        'OOP',                5, 270, '{}', true),
    (python_id, 'descriptors',         'Descriptors',              '__get__, __set__, __delete__, property internals.',                           'OOP',                5, 280, '{}', true)
  on conflict (skill_id, slug) do nothing;
  
  -- ──────────────────────────────────────────────────────────
  -- 3. SEED CONCEPT PREREQUISITES
  -- ──────────────────────────────────────────────────────────
  
  -- Helper: insert prerequisite by concept slug
  -- (Using subqueries since we can't use variables for each concept UUID easily)
  
  insert into public.concept_prerequisites (concept_id, prerequisite_id, strength)
  select c.id, p.id, 'required'
  from (values
    ('data-types',          'variables'),
    ('operators',           'data-types'),
    ('control-flow',        'operators'),
    ('functions',           'control-flow'),
    ('string-methods',      'data-types'),
    ('lists',               'control-flow'),
    ('dicts',               'lists'),
    ('sets-tuples',         'lists'),
    ('list-comprehensions', 'lists'),
    ('list-comprehensions', 'control-flow'),
    ('iterables',           'lists'),
    ('generators',          'iterables'),
    ('generators',          'functions'),
    ('exception-handling',  'control-flow'),
    ('file-io',             'exception-handling'),
    ('context-managers',    'file-io'),
    ('context-managers',    'exception-handling'),
    ('classes',             'functions'),
    ('classes',             'dicts'),
    ('dunder-methods',      'classes'),
    ('decorators',          'functions'),
    ('decorators',          'closures'),
    ('mutable-defaults',    'functions'),
    ('mutable-defaults',    'lists'),
    ('shallow-copy',        'lists'),
    ('shallow-copy',        'dicts'),
    ('closures',            'functions'),
    ('truthiness',          'data-types'),
    ('truthiness',          'control-flow'),
    ('typing',              'functions'),
    ('typing',              'classes'),
    ('async-fundamentals',  'functions'),
    ('async-fundamentals',  'exception-handling'),
    ('asyncio-patterns',    'async-fundamentals'),
    ('asyncio-patterns',    'generators'),
    ('threading-gil',       'functions'),
    ('threading-gil',       'classes'),
    ('metaclasses',         'classes'),
    ('metaclasses',         'decorators'),
    ('metaclasses',         'dunder-methods'),
    ('descriptors',         'classes'),
    ('descriptors',         'dunder-methods')
  ) as edges(concept_slug, prereq_slug)
  join public.concepts c on c.slug = edges.concept_slug and c.skill_id = python_id
  join public.concepts p on p.slug = edges.prereq_slug and p.skill_id = python_id
  on conflict (concept_id, prerequisite_id) do nothing;
  
end;
$$;

-- ────────────────────────────────────────────────────────────
-- 4. SEED A FEW PYTHON CARDS (Zero-Syntax philosophy examples)
-- ────────────────────────────────────────────────────────────

do $$
declare
  python_id uuid;
  concept_ctx_mgr uuid;
  concept_mutable uuid;
  concept_shallow uuid;
  concept_async uuid;
  concept_list_comp uuid;
begin
  select id into python_id from public.skills where slug = 'python';
  select id into concept_ctx_mgr from public.concepts where slug = 'context-managers' and skill_id = python_id;
  select id into concept_mutable from public.concepts where slug = 'mutable-defaults' and skill_id = python_id;
  select id into concept_shallow from public.concepts where slug = 'shallow-copy' and skill_id = python_id;
  select id into concept_async from public.concepts where slug = 'async-fundamentals' and skill_id = python_id;
  select id into concept_list_comp from public.concepts where slug = 'list-comprehensions' and skill_id = python_id;

  insert into public.cards (concept_id, card_type, title, lang, code, is_bad_code, explanation, failure_mode, source, difficulty, is_published) values
    -- Code Review: Context Manager (bad)
    (concept_ctx_mgr, 'code-review', 'File handling without context manager', 'python',
     E'f = open(''data.txt'', ''r'')\ncontent = f.read()\n# Missing f.close()',
     true,
     'Always use the `with` statement for file handling to ensure files are closed properly even if an exception occurs.',
     null, 'curated', 2, true),
    
    -- Code Review: List Comprehension (good)
    (concept_list_comp, 'code-review', 'List comprehension', 'python',
     E'squares = [x**2 for x in range(10) if x % 2 == 0]',
     false,
     'This is the Pythonic way to create lists. It''s concise and generally faster than a standard for-loop.',
     null, 'curated', 1, true),
    
    -- Code Review: Mutable Default (bad)
    (concept_mutable, 'code-review', 'Mutable default argument', 'python',
     E'def append_to(element, target=[]):\n    target.append(element)\n    return target',
     true,
     'Default mutable arguments are shared across calls. Use `None` as default and create inside the function body.',
     'logic_error', 'curated', 3, true),

    -- AI Audit: Copilot-generated async without error handling
    (concept_async, 'ai-audit', 'Copilot-generated async fetch without timeout', 'python',
     E'async def fetch_all(urls):\n    results = []\n    for url in urls:\n        resp = await aiohttp.get(url)\n        results.append(await resp.json())\n    return results',
     true,
     'This AI-generated code has multiple issues: 1) No timeout — a slow endpoint blocks forever. 2) Sequential awaits in a loop — should use asyncio.gather() for concurrency. 3) No error handling — one failed request loses all results.',
     'hallucination', 'ai_generated', 4, true),
    
    -- Predict Output: Shallow Copy
    (concept_shallow, 'predict-output', 'List multiplication surprise', 'python',
     E'a = [[0]] * 3\na[0][0] = 5\nprint(a)',
     null,
     '`[[0]] * 3` creates 3 references to the same inner list. Mutating one mutates all of them. Use a list comprehension `[[0] for _ in range(3)]` instead.',
     'logic_error', 'curated', 3, true);
  
  -- Update options for predict-output card  
  update public.cards
  set options = '["[[5], [0], [0]]", "[[5], [5], [5]]", "[[0], [0], [5]]", "Error"]'::jsonb,
      correct_index = 1
  where title = 'List multiplication surprise'
    and concept_id = concept_shallow;

end;
$$;
