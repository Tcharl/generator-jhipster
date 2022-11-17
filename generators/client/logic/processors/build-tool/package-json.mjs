/**
 * Copyright 2013-2022 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see https://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const checkPackageJsonSectionExists = (packageJson, section) => {
  return packageJson[section] !== undefined;
};

const matchDependency = (dependencyKey, dependencyReference) => {
  return dependencyReference.startsWith(dependencyKey);
};

/**
 * Substitutes a version in a package.json file
 * @param sourcePackageJson the source package.json file which contains the version to substitute
 * @param targetPackageJson the target package.json file which may contain the dependency and a hash and that will contains the substituted version
 * @param section the section of the package.json file where the dependency is
 * @param keyToReplace the dependency kay to replace
 */
const substitutePackageJsonDependencyVersionAccordingToSource = (sourcePackageJson, targetPackageJson, section, keyToReplace) => {
  if (checkPackageJsonSectionExists(targetPackageJson, section)) {
    Object.entries(targetPackageJson[section]).forEach(([dependency, dependencyReference]) => {
      if (matchDependency(keyToReplace, dependencyReference)) {
        const [keyToReplaceAtSource, sectionAtSource = section, dependencyAtSource = dependency] = dependencyReference.split('#');
        if (keyToReplaceAtSource !== keyToReplace) return;
        if (!sourcePackageJson[sectionAtSource] || !sourcePackageJson[sectionAtSource][dependencyAtSource]) {
          throw new Error(`Error setting ${dependencyAtSource} version, not found at ${sectionAtSource}.${dependencyAtSource}`);
        }
        targetPackageJson[section][dependency] = sourcePackageJson[sectionAtSource][dependencyAtSource];
      }
    });
  }
  return targetPackageJson;
};

export default substitutePackageJsonDependencyVersionAccordingToSource;
