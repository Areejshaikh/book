#!/usr/bin/env python3
"""
Verification script for textbook generation functionality
"""
import os
import sys
import subprocess
from pathlib import Path


def verify_project_structure():
    """Verify that the required project directories and files exist"""
    print("Verifying project structure...")

    frontend_dir = Path("frontend")
    backend_dir = Path("backend")

    if not frontend_dir.exists():
        print("ERROR: Frontend directory not found!")
        return False
    else:
        print("SUCCESS: Frontend directory exists")

    if not backend_dir.exists():
        print("ERROR: Backend directory not found!")
        return False
    else:
        print("SUCCESS: Backend directory exists")

    # Check for required frontend files
    required_frontend_files = [
        "src/pages/index.tsx",
        "src/pages/chapters/[id].tsx",
        "src/pages/chat.tsx",
        "src/pages/profile.tsx",
        "src/pages/progress.tsx",
        "src/components/ChapterContent.tsx",
        "src/components/ChapterNavigation.tsx",
        "src/components/TableOfContents.tsx",
        "src/components/ChatComponent.tsx",
        "src/components/QuizComponent.tsx",
        "src/components/LearningMaterials.tsx"
    ]

    missing_files = []
    for file_path in required_frontend_files:
        file = frontend_dir / file_path
        if not file.exists():
            missing_files.append(file_path)
        else:
            print(f"SUCCESS: Frontend file exists: {file_path}")

    if missing_files:
        for file_path in missing_files:
            print(f"ERROR: Frontend file missing: {file_path}")
        return False

    # Check for required backend files
    required_backend_files = [
        "src/api/chapters.py",
        "src/api/chat.py",
        "src/api/learning_materials.py",
        "src/api/progress.py",
        "src/api/translation.py",
        "src/models/chapter.py",
        "src/models/user_progress.py",
        "src/services/chapter_service.py",
        "src/services/chat_service.py",
        "src/services/learning_materials_service.py"
    ]

    missing_backend_files = []
    for file_path in required_backend_files:
        file = backend_dir / file_path
        if not file.exists():
            missing_backend_files.append(file_path)
        else:
            print(f"SUCCESS: Backend file exists: {file_path}")

    if missing_backend_files:
        for file_path in missing_backend_files:
            print(f"ERROR: Backend file missing: {file_path}")
        return False

    return True


def verify_api_endpoints():
    """Verify that the API endpoints are properly set up"""
    print("\nVerifying API endpoints...")

    # Check if routers are properly configured
    api_router_file = Path("backend/src/api/routers.py")
    if not api_router_file.exists():
        print("ERROR: API routers file not found!")
        return False

    with open(api_router_file, 'r') as f:
        content = f.read()

    required_routes = [
        'chapters.router',
        'chat.router',
        'learning_materials.router',
        'progress.router',
        'translation.router'
    ]

    missing_routes = []
    for route in required_routes:
        if route not in content:
            missing_routes.append(route)
        else:
            print(f"SUCCESS: API route included: {route}")

    if missing_routes:
        for route in missing_routes:
            print(f"ERROR: API route not included in routers: {route}")
        return False

    return True


def verify_types_and_schemas():
    """Verify that types and schemas are properly defined"""
    print("\nVerifying data types and schemas...")

    # Check frontend types
    frontend_types_dir = Path("frontend/src/types")
    if not frontend_types_dir.exists():
        print("ERROR: Frontend types directory not found!")
        return False
    else:
        print("SUCCESS: Frontend types directory exists")

    required_types = [
        "chapter.ts",
        "learningMaterials.ts",
        "progress.ts"
    ]

    missing_types = []
    for type_file in required_types:
        file_path = frontend_types_dir / type_file
        if not file_path.exists():
            missing_types.append(type_file)
        else:
            print(f"SUCCESS: Frontend type file exists: {type_file}")

    if missing_types:
        for type_file in missing_types:
            print(f"ERROR: Frontend type file missing: {type_file}")
        return False

    # Check backend schemas
    backend_schemas_dir = Path("backend/src/schemas")
    if not backend_schemas_dir.exists():
        print("ERROR: Backend schemas directory not found!")
        return False
    else:
        print("SUCCESS: Backend schemas directory exists")

    schema_files = list(backend_schemas_dir.glob("*.py"))
    if not schema_files:
        print("ERROR: No schema files found in backend")
        return False
    else:
        print(f"SUCCESS: Found {len(schema_files)} backend schema files")

    return True


def verify_functionality():
    """Verify that core functionality is implemented"""
    print("\nVerifying core functionality...")

    # Check that the main API is updated to use new routers
    main_file = Path("backend/main.py")
    if not main_file.exists():
        print("ERROR: Backend main.py file not found!")
        return False

    with open(main_file, 'r') as f:
        content = f.read()

    if "from src.api.routers import api_router" not in content:
        print("ERROR: Main app not using updated routers!")
        return False
    else:
        print("SUCCESS: Main app properly imports updated routers")

    return True


def run_tests():
    """Run the implemented tests"""
    print("\nRunning tests...")

    try:
        # Check if TypeScript compiler is available
        result = subprocess.run([
            "npx", "tsc", "--noEmit", "test_implementation.ts"
        ], capture_output=True, text=True, timeout=30, cwd=".")

        if result.returncode == 0:
            print("SUCCESS: TypeScript compilation successful")
        else:
            print(f"ERROR: TypeScript compilation failed: {result.stderr}")
            return False

        return True

    except subprocess.TimeoutExpired:
        print("ERROR: Test execution timed out")
        return False
    except FileNotFoundError:
        print("ERROR: Node.js or npx not found - please install Node.js")
        return False
    except Exception as e:
        print(f"ERROR: Error running tests: {e}")
        return False


def main():
    """Main verification function"""
    print("Verifying textbook generation implementation...\n")

    all_checks_passed = True

    if not verify_project_structure():
        all_checks_passed = False

    if not verify_api_endpoints():
        all_checks_passed = False

    if not verify_types_and_schemas():
        all_checks_passed = False

    if not verify_functionality():
        all_checks_passed = False

    if not run_tests():
        all_checks_passed = False

    print("\n" + "="*60)
    if all_checks_passed:
        print("SUCCESS: All verifications passed! Implementation is complete.")
        return 0
    else:
        print("ERROR: Some verifications failed. Please check the implementation.")
        return 1
    print("="*60)


if __name__ == "__main__":
    sys.exit(main())